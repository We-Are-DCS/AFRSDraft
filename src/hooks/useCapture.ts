/**
 * useCapture — owns the full interaction-capture state machine.
 *
 * State diagram:
 *   idle → firing (handleCtaClick)
 *        → done   (after CAPTURE_LATENCY_MS)
 *        → advancing (after ADVANCE_DELAY_MS, if nextStageId exists)
 *        → idle   (after advance callback fires, or on reset)
 *
 * Callers get a stable `handleCtaClick` and `resetCapture`, plus the
 * four read-only pieces of capture state they need to drive UI.
 */

import { useState, useCallback, useEffect } from 'react';
import type { StageConfig } from '../data/cdh';
import type { Persona } from '../data/types';
import type { Platform } from '../data/platforms';
import { buildCaptureRequest, buildCaptureResponse } from '../data/captureApi';
import type { CaptureRequest, CaptureResponse } from '../data/captureApi';

export type CapturePhase = 'idle' | 'firing' | 'done' | 'advancing';

const CAPTURE_LATENCY_MS = 320;
const ADVANCE_DELAY_MS = 1800;

interface UseCaptureOptions {
  stage: StageConfig;
  effectivePageURL: string;
  persona: Persona;
  platform: Platform;
  nbaReady: boolean;
  onAdvance: (nextStageId: number) => void;
}

interface UseCaptureReturn {
  phase: CapturePhase;
  /** Convenience aliases used by child components */
  capturing: boolean;
  captured: boolean;
  captureRequest: CaptureRequest | null;
  captureResponse: CaptureResponse | null;
  handleCtaClick: () => void;
  resetCapture: () => void;
}

export function useCapture({
  stage,
  effectivePageURL,
  persona,
  platform,
  nbaReady,
  onAdvance,
}: UseCaptureOptions): UseCaptureReturn {
  const [phase, setPhase] = useState<CapturePhase>('idle');
  const [captureRequest, setCaptureRequest] = useState<CaptureRequest | null>(null);
  const [captureResponse, setCaptureResponse] = useState<CaptureResponse | null>(null);

  const resetCapture = useCallback(() => {
    setPhase('idle');
    setCaptureRequest(null);
    setCaptureResponse(null);
  }, []);

  // Reset whenever the stage or persona changes
  useEffect(() => {
    resetCapture();
  }, [stage.id, persona.id, resetCapture]);

  const handleCtaClick = useCallback(() => {
    if (!nbaReady || phase !== 'idle') return;

    const topAction = stage.actions[0];
    const nextAction = stage.actions[1] ?? stage.actions[0];
    const nextStageId = stage.id < 13 ? stage.id + 1 : null;

    const req = buildCaptureRequest(
      persona.caseId,
      topAction.ActionID,
      topAction.Treatment,
      platform.channelCode,
      platform.id,
      `SID-${persona.caseId}-${stage.id}`,
      effectivePageURL,
    );
    setCaptureRequest(req);
    setPhase('firing');

    const firingTimer = setTimeout(() => {
      const resp = buildCaptureResponse(
        topAction.ActionID,
        nextAction.ActionID,
        nextAction.ActionName,
        nextAction.Channel,
        nextAction.Treatment,
        nextAction.pAccept,
        parseFloat((Math.random() * 0.06 + 0.03).toFixed(2)),
        stage.id,
        persona.avatar,
      );
      setCaptureResponse(resp);
      setPhase('done');

      if (nextStageId) {
        const advanceTimer = setTimeout(() => {
          setPhase('advancing');
          onAdvance(nextStageId);
          // onAdvance will trigger a stage change which causes resetCapture via useEffect
        }, ADVANCE_DELAY_MS);
        return () => clearTimeout(advanceTimer);
      }
    }, CAPTURE_LATENCY_MS);

    return () => clearTimeout(firingTimer);
  }, [nbaReady, phase, stage, effectivePageURL, persona, platform, onAdvance]);

  return {
    phase,
    capturing: phase === 'firing',
    captured: phase === 'done' || phase === 'advancing',
    captureRequest,
    captureResponse,
    handleCtaClick,
    resetCapture,
  };
}

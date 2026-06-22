/**
 * useStageView — derives view-layer labels and flags from the active stage + platform.
 *
 * Centralises every `stage.id === 1` ternary that was scattered across App.tsx,
 * SimpleMobile.tsx, and WebPortal.tsx.  Child components import these derived values
 * rather than branching on the raw stage id.
 */

import { useMemo } from 'react';
import type { StageConfig } from '../data/cdh';
import type { Platform } from '../data/platforms';
import type { Persona } from '../data/types';

export interface StageViewMeta {
  /** True when the active stage is the paid-social entry point */
  isSocialStage: boolean;
  /** False for Stage 1; true for Stages 2–13 */
  isPortalStage: boolean;

  // ── Touchpoint node (left column of the 3-node flow bar) ──
  touchpointLabel: string;
  touchpointSub: string;
  touchpointColor: string;
  touchpointIcon: string;

  // ── Architecture flow bar (first card) ──
  archSourceLabel: string;
  archSourceDetail: string;
  archSourceSub: string;
  archSourceColor: string;
  archSourceIcon: string;
}

export function useStageView(
  stage: StageConfig,
  platform: Platform,
  persona: Persona,
): StageViewMeta {
  return useMemo(() => {
    const isSocialStage = stage.id === 1;
    const isPortalStage = !isSocialStage;

    const touchpointLabel = isSocialStage
      ? `${platform.icon} ${platform.label}`
      : 'Candidate Portal';
    const touchpointSub = stage.touchpoint.replace(/_/g, ' ');
    const touchpointColor = isSocialStage ? platform.color : persona.color;
    const touchpointIcon = isSocialStage ? platform.icon : '🌐';

    const archSourceLabel = isSocialStage
      ? `${platform.icon} ${platform.label}`
      : 'Candidate';
    const archSourceDetail = `${stage.signals.length} signals`;
    const archSourceSub = stage.signals.slice(0, 2).map((s) => s.signal).join(' · ');
    const archSourceColor = isSocialStage ? platform.color : persona.color;
    const archSourceIcon = isSocialStage ? platform.icon : '📡';

    return {
      isSocialStage,
      isPortalStage,
      touchpointLabel,
      touchpointSub,
      touchpointColor,
      touchpointIcon,
      archSourceLabel,
      archSourceDetail,
      archSourceSub,
      archSourceColor,
      archSourceIcon,
    };
  }, [stage, platform, persona]);
}

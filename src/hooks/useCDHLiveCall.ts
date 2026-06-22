/**
 * useCDHLiveCall — makes real POST calls to the Pega CDH Real-Time Container API.
 *
 * When `config.enabled` is false, the hook returns mock-mode state and nothing
 * is fetched — the emulator renders its built-in stageConfigs data instead.
 *
 * When enabled:
 *   1. Builds the request body from the current stage + persona + platform.
 *   2. POSTs to <baseUrl>/real-time-container/<containerName>
 *   3. Parses the response — handles both Pega-native (px/py prefix) and our
 *      custom NBAAction format so the same hook works against a real Pega instance
 *      or against a mock server.
 *   4. Returns `liveActions` (NBAAction[]) which App.tsx injects into effectiveStage
 *      so every downstream view (SimpleMobile, WebPortal) renders CDH-live data.
 */

import { useState, useEffect, useCallback } from 'react';
import type { CDHConfig } from './useCDHConfig';
import type { StageConfig, NBAAction } from '../data/cdh';
import type { Persona } from '../data/types';
import type { Platform } from '../data/platforms';

export interface LiveCallState {
  loading: boolean;
  /** Non-null when the last call succeeded and returned actions */
  liveActions: NBAAction[] | null;
  /** The raw JSON response body */
  rawResponse: Record<string, unknown> | null;
  /** The request body that was / will be sent */
  rawRequest: Record<string, unknown> | null;
  error: string | null;
  latencyMs: number | null;
  /** 'live' = last successful call was real; 'mock' = falling back to stageConfig data */
  mode: 'live' | 'mock';
}

// ── Pega response mapper ──────────────────────────────────────────────────────
// Handles the sandbox ContainerList/RankedResults format, Pega px/py prefix format,
// and our own uppercase format so the hook works against any CDH endpoint.
function mapAction(raw: Record<string, unknown>, index: number): NBAAction {
  return {
    // Identifier is the most stable unique key in the ContainerList format
    ActionID:   String(raw.Identifier ?? raw.pyActionID ?? raw.ActionID ?? raw.Name ?? `CDH-${index + 1}`),
    // Label or ShortDescription carries the human-readable name in the new format
    ActionName: String(raw.Label ?? raw.ShortDescription ?? raw.pyName ?? raw.ActionName ?? 'CDH Action'),
    Treatment:  String(raw.pyTreatment ?? raw.Treatment ?? 'DEFAULT'),
    Channel:    String(raw.pyChannel   ?? raw.Channel   ?? 'WEB'),
    Direction:  String(raw.pyDirection ?? raw.Direction ?? 'OUTBOUND'),
    // Sandbox uses Propensity; legacy Pega uses pxPropensity
    pAccept:    Number(raw.Propensity  ?? raw.pxPropensity ?? raw.pAccept ?? 0.5),
    pValue:     Number(raw.pxValue     ?? raw.pValue    ?? 0),
    Rank:       Number(raw.Rank        ?? raw.pxRank    ?? index + 1),
    ContentFragmentID: raw.ContentFragmentID ? String(raw.ContentFragmentID) : undefined,
    AudienceSegment:  (raw.AudienceSegment ?? raw.pySegmentID ?? raw.Group)
      ? String(raw.AudienceSegment ?? raw.pySegmentID ?? raw.Group)
      : undefined,
    Label:            raw.Label            ? String(raw.Label)            : undefined,
    ShortDescription: raw.ShortDescription ? String(raw.ShortDescription) : undefined,
    Benefits:         raw.Benefits         ? String(raw.Benefits)         : undefined,
    ImageURL:         raw.ImageURL         ? String(raw.ImageURL)         : undefined,
    // Video creative fields
    videoURL:          raw.videoURL          ? String(raw.videoURL)          : undefined,
    videoThumbnailURL: raw.videoThumbnailURL ? String(raw.videoThumbnailURL) : undefined,
    videoDuration:     raw.videoDuration     ? String(raw.videoDuration)     : undefined,
    videoTitle:        raw.videoTitle        ? String(raw.videoTitle)        : undefined,
    videoType:         raw.videoType         ? (raw.videoType as NBAAction['videoType']) : undefined,
  };
}

// Extract ranked actions from any response shape:
//   • Sandbox v4:  { ContainerList: [{ RankedResults: [...] }] }
//   • Pega native: { pxResults: [...] }
//   • Custom/mock: { Actions: [...] } | { actions: [...] } | { propositions: [...] }
function rawActions(data: Record<string, unknown>): Record<string, unknown>[] {
  const containerList = data.ContainerList;
  if (Array.isArray(containerList) && containerList.length > 0) {
    const first = containerList[0] as Record<string, unknown>;
    const ranked = first.RankedResults;
    if (Array.isArray(ranked) && ranked.length > 0) return ranked as Record<string, unknown>[];
  }
  const arr = data.pxResults ?? data.Actions ?? data.actions ?? data.propositions ?? [];
  return Array.isArray(arr) ? arr as Record<string, unknown>[] : [];
}

const ARMY_CDH_URL = 'https://sandbox.dcsdevcloud.com/prweb/api/PegaMKTContainer/v4/container';

// ── Hook ──────────────────────────────────────────────────────────────────────
export interface UseCDHLiveCallReturn extends LiveCallState {
  /** Call the CDH endpoint now. Optionally pass a custom body to override auto-build. */
  callCDH: (customBody?: Record<string, unknown>) => Promise<void>;
  /** Returns the auto-generated request body so the UI can pre-populate the editor. */
  buildRequestBody: () => Record<string, unknown>;
}

export function useCDHLiveCall(
  config: CDHConfig,
  stage: StageConfig,
  persona: Persona,
  platform: Platform,
): UseCDHLiveCallReturn {
  const [state, setState] = useState<LiveCallState>({
    loading: false,
    liveActions: null,
    rawResponse: null,
    rawRequest: null,
    error: null,
    latencyMs: null,
    mode: 'mock',
  });

  // Auto-generated request body.
  // For the James / Army persona the CDH endpoint expects the flat Pega v2 format.
  // All other personas use the nested CustomerProfile / DecisioningContext format.
  const buildRequestBody = useCallback((): Record<string, unknown> => {
    if (persona.service === 'army') {
      return {
        SubjectID:     'CUST-100001',
        ContextName:   'Customer',
        ContainerName: 'ArmyNBA',
        Channel:       'Web',
        Direction:     'Inbound',
        AppID:         'CDHAFRSApp',
        Placements:    'Hero,Tile,Tile',
      };
    }
    return {
      DecisioningContext: {
        Channel:       stage.channel,
        Direction:     'INBOUND',
        ContainerName: config.useStageContainer ? stage.containerName : config.containerOverride,
        Touchpoint:    stage.touchpoint,
      },
      CustomerProfile: {
        CustomerID:      persona.caseId,
        Service:         persona.service.toUpperCase(),
        RolePreference:  persona.role,
        SignalCount:     stage.signals.length,
        PropensityScore: stage.propensity / 100,
      },
      Context: {
        PageURL:   stage.pageURL,
        SessionID: `SID-${persona.caseId}-${stage.id}`,
        Timestamp: new Date().toISOString(),
      },
    };
  }, [config, stage, persona]);

  const callCDH = useCallback(async (customBody?: Record<string, unknown>) => {
    if (!config.enabled) return;

    const body = customBody ?? buildRequestBody();
    // Flat-format bodies (James / Army) carry ContainerName at the top level.
    // Fall back to config/stage value for nested-format bodies.
    const containerName = (typeof body.ContainerName === 'string' && body.ContainerName)
      ? body.ContainerName
      : config.useStageContainer
        ? stage.containerName
        : (config.containerOverride || stage.containerName);

    const rawBase = config.baseUrl.replace(/\/+$/, '');
    const proxied = config.corsProxy
      ? `${config.corsProxy.replace(/\/+$/, '')}/${rawBase}`
      : rawBase;
    // Army persona uses the dedicated v4 /container endpoint; others use real-time-container.
    const targetUrl = persona.service === 'army'
      ? ARMY_CDH_URL
      : `${proxied}/real-time-container/${encodeURIComponent(containerName)}`;
    const url = config.corsProxy && persona.service === 'army'
      ? `${config.corsProxy.replace(/\/+$/, '')}/${ARMY_CDH_URL}`
      : targetUrl;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (config.authType === 'bearer' && config.authToken) {
      headers['Authorization'] = `Bearer ${config.authToken}`;
    } else if (config.authType === 'basic' && config.authToken) {
      headers['Authorization'] = `Basic ${config.authToken}`;
    }

    setState((prev) => ({ ...prev, loading: true, rawRequest: body, error: null }));
    const t0 = Date.now();

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const latencyMs = Date.now() - t0;

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` — ${text.slice(0, 120)}` : ''}`);
      }

      const data: Record<string, unknown> = await res.json();
      const actions = rawActions(data).map(mapAction);

      setState({
        loading: false,
        liveActions: actions.length ? actions : null,
        rawResponse: data,
        rawRequest: body,
        error: null,
        latencyMs,
        mode: 'live',
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        liveActions: null,
        rawResponse: null,
        error: err instanceof Error ? err.message : String(err),
        latencyMs: Date.now() - t0,
        mode: 'mock',
      }));
    }
  }, [config, stage, persona, platform, buildRequestBody]);

  // Auto-call when live mode is toggled on or stage/persona/platform changes
  useEffect(() => {
    if (config.enabled) {
      void callCDH();
    } else {
      setState({
        loading: false,
        liveActions: null,
        rawResponse: null,
        rawRequest: null,
        error: null,
        latencyMs: null,
        mode: 'mock',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.enabled, stage.id, persona.id, platform.id]);

  return { ...state, callCDH, buildRequestBody };
}

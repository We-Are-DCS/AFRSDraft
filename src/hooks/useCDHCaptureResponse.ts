/**
 * useCDHCaptureResponse
 *
 * Fires a real POST to the CDH capture_response endpoint when the candidate
 * clicks "Learn more" / "Accept" while CDH live mode is enabled.
 *
 * Request values are sourced directly from ContainerList[0].RankedResults[0]
 * of the most recent CDH NBA response so that InteractionID and all other
 * identifiers match the decision that was served.
 */

import { useState, useCallback } from 'react';
import type { CDHConfig } from './useCDHConfig';

const CAPTURE_URL = 'https://sandbox.dcsdevcloud.com/prweb/api/PegaMKTContainer/v4/capture_response';

export interface CaptureResponseState {
  loading: boolean;
  success: boolean;
  rawResponse: Record<string, unknown> | null;
  error: string | null;
}

export interface UseCDHCaptureResponseReturn extends CaptureResponseState {
  fireCaptureResponse: () => Promise<void>;
}

export function useCDHCaptureResponse(
  config: CDHConfig,
  rawNBAResponse: Record<string, unknown> | null,
): UseCDHCaptureResponseReturn {
  const [state, setState] = useState<CaptureResponseState>({
    loading: false,
    success: false,
    rawResponse: null,
    error: null,
  });

  const fireCaptureResponse = useCallback(async () => {
    if (!config.enabled || !rawNBAResponse) return;

    // Extract the first ranked result from the CDH NBA response
    const containerList = rawNBAResponse.ContainerList;
    if (!Array.isArray(containerList) || containerList.length === 0) return;

    const container = containerList[0] as Record<string, unknown>;
    const rankedResults = container.RankedResults;
    if (!Array.isArray(rankedResults) || rankedResults.length === 0) return;

    const top = rankedResults[0] as Record<string, unknown>;

    const body = {
      SubjectID:     top.SubjectID   ?? 'CUST-100001',
      ContextName:   top.ContextName ?? 'Customer',
      ContainerName: container.ContainerName ?? 'ArmyNBA',
      AppID:         'CDHAFRSApp',
      RankedResults: [
        {
          SubjectID:     top.SubjectID   ?? 'CUST-100001',
          Name:          top.Name        ?? '',
          Issue:         top.Issue       ?? '',
          Group:         top.Group       ?? '',
          Direction:     top.Direction   ?? 'Inbound',
          Channel:       top.Channel     ?? 'Web',
          Rank:          top.Rank        ?? 1,
          InteractionID: top.InteractionID ?? '',
          Outcome:       'Accepted',
        },
      ],
    };

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (config.authType === 'bearer' && config.authToken) {
      headers['Authorization'] = `Bearer ${config.authToken}`;
    } else if (config.authType === 'basic' && config.authToken) {
      headers['Authorization'] = `Basic ${config.authToken}`;
    }

    const url = config.corsProxy
      ? `${config.corsProxy.replace(/\/+$/, '')}/${CAPTURE_URL}`
      : CAPTURE_URL;

    setState({ loading: true, success: false, rawResponse: null, error: null });

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data: Record<string, unknown> = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      setState({ loading: false, success: true, rawResponse: data, error: null });
    } catch (err) {
      setState({
        loading: false,
        success: false,
        rawResponse: null,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }, [config, rawNBAResponse]);

  return { ...state, fireCaptureResponse };
}

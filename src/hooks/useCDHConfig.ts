/**
 * useCDHConfig — manages the user-editable CDH Real-Time Container configuration.
 *
 * Persisted to localStorage so settings survive page reload.
 * The `enabled` flag is the live/mock switch; when false, the emulator
 * falls back to the built-in stageConfigs data.
 */

import { useState } from 'react';

export type AuthType = 'bearer' | 'basic' | 'none';

export interface CDHConfig {
  /** When true, the emulator makes real POST calls to the CDH endpoint */
  enabled: boolean;
  /** Full base URL — e.g. https://your-pega.com/prweb/api/v1 */
  baseUrl: string;
  authType: AuthType;
  /**
   * Bearer: the raw token string.
   * Basic: base64(username:password) — paste the already-encoded value.
   */
  authToken: string;
  /** Use the container name defined on the stage (recommended) */
  useStageContainer: boolean;
  /** Overrides stage.containerName when useStageContainer is false */
  containerOverride: string;
  /**
   * Optional CORS proxy prefix — prepended to the full request URL.
   * e.g. https://corsproxy.io/?  (leave empty if your CDH allows CORS)
   */
  corsProxy: string;
}

export const DEFAULT_CDH_CONFIG: CDHConfig = {
  enabled: false,
  baseUrl: 'https://sandbox.dcsdevcloud.com/prweb/api/PegaMKTContainer/v4',
  authType: 'bearer',
  authToken: '',
  useStageContainer: true,
  containerOverride: '',
  corsProxy: '',
};

const STORAGE_KEY = 'arfs-cdh-api-config';

function load(): CDHConfig {
  try {
    return { ...DEFAULT_CDH_CONFIG, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') };
  } catch {
    return DEFAULT_CDH_CONFIG;
  }
}

export interface UseCDHConfigReturn {
  config: CDHConfig;
  updateConfig: (patch: Partial<CDHConfig>) => void;
  resetConfig: () => void;
}

export function useCDHConfig(): UseCDHConfigReturn {
  const [config, setConfig] = useState<CDHConfig>(load);

  const updateConfig = (patch: Partial<CDHConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CDH_CONFIG);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { config, updateConfig, resetConfig };
}

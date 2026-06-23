import { LogLevel, type Configuration } from '@azure/msal-browser';

/**
 * Microsoft Entra (Azure AD) SSO configuration for DCS.
 *
 * Values are read from Vite env vars (see .env.example):
 *   VITE_ENTRA_CLIENT_ID    – Application (client) ID from the Entra App Registration
 *   VITE_ENTRA_TENANT_ID    – DCS directory (tenant) ID
 *   VITE_ENTRA_REDIRECT_URI – optional; defaults to the current origin
 *
 * When the IDs are absent the app still runs (demo accounts work); the
 * "Continue with Microsoft Entra" button is disabled until they are set.
 */
const clientId = import.meta.env.VITE_ENTRA_CLIENT_ID as string | undefined;
const tenantId = import.meta.env.VITE_ENTRA_TENANT_ID as string | undefined;
const redirectUri =
  (import.meta.env.VITE_ENTRA_REDIRECT_URI as string | undefined) ||
  (typeof window !== 'undefined' ? window.location.origin : '');

/** True only when both Entra IDs are supplied. */
export const entraConfigured = Boolean(clientId && tenantId);

// MSAL refuses to construct with an empty clientId, so fall back to an
// all-zero GUID when unconfigured. SSO is gated by `entraConfigured` anyway.
const PLACEHOLDER_GUID = '00000000-0000-0000-0000-000000000000';

export const msalConfig: Configuration = {
  auth: {
    clientId: clientId || PLACEHOLDER_GUID,
    // Single-tenant authority scoped to the DCS directory.
    authority: `https://login.microsoftonline.com/${tenantId || 'common'}`,
    redirectUri,
    postLogoutRedirectUri: redirectUri,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      loggerCallback: () => {},
      piiLoggingEnabled: false,
    },
  },
};

/** Scopes requested at sign-in. User.Read covers basic profile via Graph. */
export const loginRequest = {
  scopes: ['User.Read'],
};

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PublicClientApplication, EventType, type AuthenticationResult, type EventMessage } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import './index.css'
import AuthGate from './auth/AuthGate.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { msalConfig } from './auth/msalConfig.ts'
import { logAudit } from './auth/auditLog.ts'

const msalInstance = new PublicClientApplication(msalConfig)

// MSAL v5 requires explicit initialization before any other API call.
msalInstance
  .initialize()
  .then(() => {
    // Restore an active account across reloads.
    const accounts = msalInstance.getAllAccounts()
    if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0])
    }

    // Keep the active account in sync after interactive sign-in, and record
    // Entra auth outcomes to the audit trail.
    msalInstance.addEventCallback((event: EventMessage) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const result = event.payload as AuthenticationResult
        msalInstance.setActiveAccount(result.account)
        logAudit({
          event: 'login_success',
          method: 'entra',
          userId: result.account?.homeAccountId,
          userName: result.account?.name,
          userEmail: result.account?.username,
          detail: 'Microsoft Entra SSO',
        })
      }
    })

    // Complete any redirect sign-in that is coming back to the app.
    // A rejected promise here means the Entra redirect returned an error.
    return msalInstance.handleRedirectPromise().catch((err: unknown) => {
      logAudit({
        event: 'login_failure',
        method: 'entra',
        detail: err instanceof Error ? err.message : 'Entra sign-in failed',
      })
      return null
    })
  })
  .then(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <MsalProvider instance={msalInstance}>
          <ThemeProvider>
            <AuthGate />
          </ThemeProvider>
        </MsalProvider>
      </StrictMode>,
    )
  })

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PublicClientApplication, EventType, type AuthenticationResult } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import './index.css'
import AuthGate from './auth/AuthGate.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { msalConfig } from './auth/msalConfig.ts'

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

    // Keep the active account in sync after interactive sign-in.
    msalInstance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const result = event.payload as AuthenticationResult
        msalInstance.setActiveAccount(result.account)
      }
    })

    // Complete any redirect sign-in that is coming back to the app.
    return msalInstance.handleRedirectPromise()
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

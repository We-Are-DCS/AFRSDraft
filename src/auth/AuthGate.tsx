import { useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { LogOut } from 'lucide-react';
import App from '../App';
import LoginPage, { type DemoUser } from '../components/LoginPage';
import { loginRequest } from './msalConfig';

const DEMO_AUTH_KEY = 'arfs-demo-auth-user';

function loadDemoUser(): DemoUser | null {
  try {
    return JSON.parse(sessionStorage.getItem(DEMO_AUTH_KEY) ?? 'null');
  } catch {
    return null;
  }
}

/**
 * Gates the whole application behind authentication.
 *
 * Two ways in:
 *   1. Microsoft Entra SSO (real MSAL redirect flow) — the production path.
 *   2. A demo account stored in sessionStorage — for environments with no tenant.
 */
export default function AuthGate() {
  const { instance, accounts } = useMsal();
  const isEntraAuthed = useIsAuthenticated();
  const [demoUser, setDemoUser] = useState<DemoUser | null>(loadDemoUser);

  const entraAccount = accounts[0];
  const authed = isEntraAuthed || demoUser !== null;

  const loginEntra = () => {
    void instance.loginRedirect(loginRequest);
  };

  const loginDemo = (user: DemoUser) => {
    sessionStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(user));
    setDemoUser(user);
  };

  const logout = () => {
    if (isEntraAuthed) {
      void instance.logoutRedirect({ postLogoutRedirectUri: window.location.origin });
    } else {
      sessionStorage.removeItem(DEMO_AUTH_KEY);
      setDemoUser(null);
    }
  };

  if (!authed) {
    return <LoginPage onSSOLogin={loginEntra} onDemoLogin={loginDemo} />;
  }

  const displayName = entraAccount?.name || entraAccount?.username || demoUser?.name || 'Signed in';
  const displayEmail = entraAccount?.username || demoUser?.email || '';
  const initial = displayName.trim().charAt(0).toUpperCase() || '?';
  const kind = isEntraAuthed ? 'Entra' : 'Demo';

  return (
    <>
      <App />
      <AccountChip
        initial={initial}
        name={displayName}
        email={displayEmail}
        kind={kind}
        onLogout={logout}
      />
    </>
  );
}

interface ChipProps {
  initial: string;
  name: string;
  email: string;
  kind: string;
  onLogout: () => void;
}

function AccountChip({ initial, name, email, kind, onLogout }: ChipProps) {
  return (
    <div
      className="fixed bottom-3 right-3 z-[9999] flex items-center gap-2.5 pl-2 pr-1.5 py-1.5 rounded-full"
      style={{
        background: 'rgba(13,20,36,0.92)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-black flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #1d6ee9, #16d0c5)', color: 'white' }}
        title={email}
      >
        {initial}
      </div>
      <div className="hidden sm:flex flex-col leading-tight min-w-0 max-w-[180px]">
        <span className="text-[12px] font-semibold text-white truncate">{name}</span>
        <span className="text-[10px] truncate" style={{ color: '#64748b' }}>
          {kind} · {email}
        </span>
      </div>
      <button
        onClick={onLogout}
        title="Sign out"
        className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
        style={{ color: '#94a3b8' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
          e.currentTarget.style.color = '#f87171';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#94a3b8';
        }}
      >
        <LogOut size={14} />
      </button>
    </div>
  );
}

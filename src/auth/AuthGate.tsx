import { useEffect, useRef, useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { LogOut, ScrollText, ChevronDown } from 'lucide-react';
import App from '../App';
import LoginPage, { type DemoUser } from '../components/LoginPage';
import AuditLogPanel from '../components/AuditLogPanel';
import { loginRequest } from './msalConfig';
import { logAudit } from './auditLog';

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
 *
 * All sign-in / sign-out events are recorded to the audit trail.
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
    logAudit({
      event: 'login_success',
      method: 'demo',
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      detail: `Demo account · ${user.serviceLabel}`,
    });
  };

  const logout = () => {
    if (isEntraAuthed) {
      logAudit({
        event: 'logout',
        method: 'entra',
        userId: entraAccount?.homeAccountId,
        userName: entraAccount?.name,
        userEmail: entraAccount?.username,
      });
      void instance.logoutRedirect({ postLogoutRedirectUri: window.location.origin });
    } else {
      logAudit({
        event: 'logout',
        method: 'demo',
        userId: demoUser?.id,
        userName: demoUser?.name,
        userEmail: demoUser?.email,
      });
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
      <AccountMenu
        initial={initial}
        name={displayName}
        email={displayEmail}
        kind={kind}
        onLogout={logout}
      />
    </>
  );
}

interface MenuProps {
  initial: string;
  name: string;
  email: string;
  kind: string;
  onLogout: () => void;
}

function AccountMenu({ initial, name, email, kind, onLogout }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close the menu on outside click.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <>
      <div ref={ref} className="fixed bottom-3 right-3 z-[9999]">
        {/* Dropdown */}
        {open && (
          <div
            className="absolute bottom-full right-0 mb-2 w-64 rounded-xl overflow-hidden"
            style={{
              background: 'rgba(13,20,36,0.98)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-[13px] font-semibold text-white truncate">{name}</div>
              <div className="text-[11px] truncate" style={{ color: '#64748b' }}>
                {email || '—'}
              </div>
              <span
                className="inline-block mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
                style={{ background: 'rgba(22,208,197,0.15)', color: '#16d0c5' }}
              >
                {kind} session
              </span>
            </div>
            <button
              onClick={() => {
                setShowAudit(true);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-left transition-colors"
              style={{ color: '#cbd5e1' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <ScrollText size={15} /> View audit log
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-left transition-colors"
              style={{ color: '#f87171' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        )}

        {/* Chip */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 rounded-full transition-colors"
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
          >
            {initial}
          </div>
          <div className="hidden sm:flex flex-col leading-tight min-w-0 max-w-[160px] text-left">
            <span className="text-[12px] font-semibold text-white truncate">{name}</span>
            <span className="text-[10px] truncate" style={{ color: '#64748b' }}>
              {kind} · {email}
            </span>
          </div>
          <ChevronDown
            size={14}
            style={{
              color: '#94a3b8',
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s',
            }}
          />
        </button>
      </div>

      {showAudit && <AuditLogPanel onClose={() => setShowAudit(false)} />}
    </>
  );
}

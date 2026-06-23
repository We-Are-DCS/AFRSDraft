import { useState } from 'react';
import { entraConfigured } from '../auth/msalConfig';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: string;
  service: 'army' | 'navy' | 'raf';
  color: string;
  ctaColor: string;
  avatar: string;
  serviceLabel: string;
  icon: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo-army',
    name: 'James Mitchell',
    email: 'james.mitchell@army.demo',
    role: 'REME Analyst · Attraction Phase',
    service: 'army',
    color: '#0a1206',
    ctaColor: '#c8102e',
    avatar: 'J',
    serviceLabel: 'British Army',
    icon: '⚔️',
  },
  {
    id: 'demo-navy',
    name: 'Sarah Chen',
    email: 'sarah.chen@navy.demo',
    role: 'Officer Analyst · Multi-Platform',
    service: 'navy',
    color: '#0d1c2a',
    ctaColor: '#2a77c7',
    avatar: 'S',
    serviceLabel: 'Royal Navy',
    icon: '⚓',
  },
  {
    id: 'demo-raf',
    name: 'George Williams',
    email: 'george.williams@raf.demo',
    role: 'Technician Analyst · Re-Engage',
    service: 'raf',
    color: '#001040',
    ctaColor: '#cf102d',
    avatar: 'G',
    serviceLabel: 'Royal Air Force',
    icon: '✈️',
  },
];

interface Props {
  /** Kicks off the real Microsoft Entra redirect sign-in. */
  onSSOLogin: () => void;
  /** Demo-account bypass for environments without an Entra tenant. */
  onDemoLogin: (user: DemoUser) => void;
}

export default function LoginPage({ onSSOLogin, onDemoLogin }: Props) {
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState<string | null>(null);
  const [ssoPending, setSsoPending] = useState(false);

  const handleDemoLogin = (user: DemoUser) => {
    setSigningIn(user.id);
    setTimeout(() => {
      onDemoLogin(user);
      setSigningIn(null);
    }, 600);
  };

  const handleSSO = () => {
    if (!entraConfigured || ssoPending) return;
    setSsoPending(true);
    onSSOLogin(); // triggers loginRedirect — page navigates away
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #080c18 0%, #0d1424 50%, #080c18 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 800px 600px at 50% 30%, rgba(29,110,233,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(13,20,36,0.9)',
          border: '1px solid rgba(30,41,59,0.8)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Top accent stripe */}
        <div
          style={{
            height: 3,
            background: 'linear-gradient(90deg, #ff661c, #16d0c5, #1d6ee9)',
          }}
        />

        <div className="p-8">
          {/* Logo + title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl">⚔️</span>
              <span className="text-2xl">⚓</span>
              <span className="text-2xl">✈️</span>
            </div>
            <div className="font-bold text-2xl tracking-widest mb-1" style={{ color: 'white' }}>
              AFRS Simulation Studio
            </div>
            <div className="text-[12px]" style={{ color: '#64748b' }}>
              Armed Forces Recruitment System · Pega CDH Emulator
            </div>
          </div>

          {/* Microsoft Entra SSO */}
          <button
            onClick={handleSSO}
            disabled={!entraConfigured || ssoPending}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] mb-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              if (entraConfigured) e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
          >
            {ssoPending ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
            )}
            {ssoPending ? 'Redirecting to Microsoft…' : 'Continue with Microsoft Entra'}
          </button>

          {/* Config hint when Entra isn't wired up yet */}
          {!entraConfigured && (
            <div className="text-center text-[10px] mb-6" style={{ color: '#475569' }}>
              Entra SSO not configured — set <code>VITE_ENTRA_CLIENT_ID</code> &amp;{' '}
              <code>VITE_ENTRA_TENANT_ID</code>
            </div>
          )}
          {entraConfigured && <div className="mb-6" />}

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(30,41,59,0.8)' }} />
            <span
              className="text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: '#334155' }}
            >
              Demo Accounts
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(30,41,59,0.8)' }} />
          </div>

          {/* Demo user cards */}
          <div className="space-y-3">
            {DEMO_USERS.map((user) => {
              const isHovered = hoveredUser === user.id;
              const isLoading = signingIn === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => handleDemoLogin(user)}
                  onMouseEnter={() => setHoveredUser(user.id)}
                  onMouseLeave={() => setHoveredUser(null)}
                  disabled={signingIn !== null}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 text-left"
                  style={{
                    background: isHovered
                      ? `linear-gradient(135deg, ${user.color}40, ${user.color}20)`
                      : `linear-gradient(135deg, ${user.color}25, ${user.color}10)`,
                    border: `1px solid ${isHovered ? user.ctaColor + '60' : user.color + '50'}`,
                    transform: isHovered ? 'scale(1.01)' : 'scale(1)',
                    boxShadow: isHovered ? `0 4px 20px ${user.ctaColor}20` : 'none',
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-black text-base flex-shrink-0"
                    style={{ background: user.ctaColor, color: 'white' }}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      user.avatar
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-white leading-tight">{user.name}</div>
                    <div className="text-[11px] mt-0.5 truncate" style={{ color: '#64748b' }}>
                      {user.email}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: user.ctaColor }}>
                      {user.role}
                    </div>
                  </div>

                  {/* Service badge */}
                  <div
                    className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold"
                    style={{
                      background: `${user.ctaColor}20`,
                      color: user.ctaColor,
                      border: `1px solid ${user.ctaColor}40`,
                    }}
                  >
                    <span>{user.icon}</span>
                    <span className="hidden sm:inline">{user.serviceLabel}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-[10px]" style={{ color: '#1e293b' }}>
            Demo environment · Not for operational use
          </div>
        </div>
      </div>

      {/* Version tag */}
      <div className="mt-4 text-[10px] font-mono" style={{ color: '#1e293b' }}>
        v2.0 · Pega CDH Real-Time Container · AFRS Phase 1–5
      </div>
    </div>
  );
}

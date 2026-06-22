import { Zap, Lock } from 'lucide-react';
import type { StageConfig } from '../data/cdh';
import type { Persona } from '../data/types';
import type { Platform } from '../data/platforms';
import CDHLiveCard from './CDHLiveCard';

interface Props {
  stage: StageConfig;
  persona: Persona;
  nbaReady: boolean;
  platform: Platform;
  capturing: boolean;
  captured: boolean;
  onCtaClick: () => void;
  isLive?: boolean;
}

const serviceColor: Record<string, string> = { army: '#4a6741', navy: '#003087', raf: '#003591' };
const serviceName: Record<string, string> = { army: 'Army Jobs', navy: 'Royal Navy', raf: 'RAF Careers' };

function CDHBadge({ label = 'CDH PERSONALISED' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold"
      style={{ background: '#006dcc20', color: '#006dcc', border: '1px solid #006dcc40' }}>
      <Zap size={9} /> {label}
    </span>
  );
}


// ── Social desktop (Stage 1) ──────────────────────────────────────────────────
function SocialDesktop({ stage, persona, platform, nbaReady, onCtaClick, capturing, captured, isLive }: Props) {
  const color = platform.color;
  const topAction = stage.actions[0];
  return (
    <div className="flex h-full min-h-[420px]">
      {/* Sidebar */}
      <div className="w-52 border-r flex-shrink-0 p-3 space-y-2" style={{ borderColor: '#e5e7eb', background: '#f9fafb' }}>
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Navigation</div>
        {['Home', 'Explore', 'Notifications', 'Messages', 'Saved'].map((item) => (
          <div key={item} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-gray-700 hover:bg-gray-200 cursor-pointer">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            {item}
          </div>
        ))}
        <div className="pt-2 border-t" style={{ borderColor: '#e5e7eb' }}>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Suggested</div>
          <div className="text-[10px] text-gray-500 px-2">UK Armed Forces · Follow</div>
          <div className="text-[10px] text-gray-500 px-2 mt-1">Army Jobs · Follow</div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-auto p-3 space-y-3" style={{ background: '#f3f4f6' }}>
        {/* CDH-served sponsored post */}
        {!nbaReady && (
          <div className="bg-white rounded-lg p-3 shadow-sm border animate-pulse" style={{ borderColor: '#e5e7eb' }}>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-20 bg-gray-100 rounded mb-2" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        )}
        {nbaReady && (
          <div className="bg-white rounded-lg shadow-sm border slide-in" style={{ borderColor: color, borderWidth: 2 }}>
            <div className="px-3 pt-2 pb-1 flex items-center justify-between">
              <div className="text-[10px] text-gray-400">Sponsored · <CDHBadge /></div>
            </div>
            <div className="px-3 pb-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: color }}>
                  {persona.avatar}
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-800">{serviceName[persona.service]}</div>
                  <div className="text-[10px] text-gray-400">Promoted</div>
                </div>
              </div>
              {isLive ? (
                <div className="rounded-lg overflow-hidden mb-2" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
                  <CDHLiveCard action={topAction} persona={persona} rank={1} total={stage.actions.length} />
                </div>
              ) : (
                <div
                  className="rounded-lg p-3 mb-2"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                >
                  <div className="text-white text-xs font-bold mb-1">{topAction.ActionName}</div>
                  <div className="text-white/70 text-[10px]">{topAction.Treatment} · pAccept {(topAction.pAccept * 100).toFixed(0)}%</div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={onCtaClick}
                  disabled={capturing || captured}
                  className="flex-1 py-1.5 rounded-lg text-white text-xs font-bold transition-all"
                  style={{ background: captured ? '#22c55e' : capturing ? '#94a3b8' : color }}
                >
                  {captured ? '✓ Captured' : capturing ? 'Firing capture…' : platform.cta}
                </button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold border" style={{ borderColor: color, color }}>Share</button>
              </div>
              {nbaReady && !captured && (
                <div className="mt-1.5 text-[9px] text-gray-400 text-center font-mono">
                  Rank 1 · {(topAction.pAccept * 100).toFixed(0)}% pAccept · £{topAction.pValue.toLocaleString()} pValue
                </div>
              )}
            </div>
          </div>
        )}

        {/* Another organic post */}
        <div className="bg-white rounded-lg p-3 shadow-sm border" style={{ borderColor: '#e5e7eb' }}>
          <div className="h-3 bg-gray-100 rounded w-3/4 mb-1" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

// ── Careers website (Stage 2) ─────────────────────────────────────────────────
function CareersWebsite({ stage, persona, nbaReady, onCtaClick, capturing, captured, isLive }: Props) {
  const color = serviceColor[persona.service];
  const topAction = stage.actions[0];
  return (
    <div className="min-h-[420px] text-gray-800" style={{ background: '#f9fafb' }}>
      {/* Nav */}
      <div className="flex items-center gap-4 px-4 py-2 shadow-sm text-xs" style={{ background: color }}>
        <span className="text-white font-bold text-sm">{serviceName[persona.service]}</span>
        {['Roles', 'Life', 'Benefits', 'Apply'].map((item) => (
          <span key={item} className="text-white/70 cursor-pointer hover:text-white">{item}</span>
        ))}
        <button className="ml-auto px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
          My Application
        </button>
      </div>

      {/* Hero */}
      {!nbaReady ? (
        <div className="h-36 animate-pulse" style={{ background: `${color}30` }} />
      ) : isLive && topAction.ImageURL ? (
        <div className="relative h-36 overflow-hidden slide-in">
          <img
            src={topAction.ImageURL}
            alt={topAction.Label ?? topAction.ActionName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-end pb-3 px-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }}>
            <div className="absolute top-2 right-2">
              <CDHBadge label="CDH HERO VARIANT" />
            </div>
            <div className="text-white font-black text-lg leading-tight drop-shadow">
              {topAction.Label ?? topAction.ShortDescription ?? topAction.ActionName}
            </div>
            {topAction.Treatment && (
              <div className="text-white/80 text-xs mt-0.5">{topAction.Treatment}</div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative h-36 flex items-end pb-3 px-4 slide-in" style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
          <div className="absolute top-2 right-2 flex gap-1 flex-wrap justify-end">
            <CDHBadge label="CDH HERO VARIANT" />
          </div>
          <div>
            <div className="text-white font-black text-lg leading-tight">
              {persona.id === 'james' ? 'REME — Engineer the Army.' : persona.id === 'sarah' ? 'Lead at Sea. Officer Pathway.' : 'Engineer the Future of Flight.'}
            </div>
            <div className="text-white/70 text-xs mt-0.5">{topAction.ActionName}</div>
          </div>
        </div>
      )}

      <div className="p-3 grid grid-cols-3 gap-2">
        {/* Role match card / CDH live tiles */}
        <div className="col-span-2 space-y-2">
          {isLive && nbaReady && stage.actions.slice(1).length > 0 ? (
            /* CDH live — render rank 2+ as tiles */
            <>
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-bold text-gray-700">Recommended Roles</div>
                <CDHBadge />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {stage.actions.slice(1).map((action) => (
                  <div key={action.ActionID} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col" style={{ borderColor: '#e5e7eb' }}>
                    {/* Tile image */}
                    <div className="h-24 bg-gray-100 overflow-hidden flex-shrink-0">
                      {action.ImageURL ? (
                        <img
                          src={action.ImageURL}
                          alt={action.Label ?? action.ActionName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: `${color}18` }}>
                          <div className="w-10 h-10 rounded-full opacity-30" style={{ background: color }} />
                        </div>
                      )}
                    </div>
                    {/* Tile content */}
                    <div className="p-2.5 flex flex-col flex-1">
                      {/* Category label */}
                      {(action.AudienceSegment ?? action.Treatment) && (
                        <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color }}>
                          {action.AudienceSegment ?? action.Treatment}
                        </div>
                      )}
                      {/* Title */}
                      <div className="text-[11px] font-bold text-gray-800 leading-tight mb-1">
                        {action.Label ?? action.ActionName}
                      </div>
                      {/* Short description */}
                      {(action.ShortDescription ?? action.Benefits) && (
                        <div className="text-[9px] text-gray-500 leading-snug mb-2 flex-1">
                          {action.ShortDescription ?? action.Benefits}
                        </div>
                      )}
                      {/* Footer: learn more + rank */}
                      <div className="flex items-center justify-between mt-auto pt-1">
                        <button
                          className="px-2.5 py-1 rounded text-white text-[9px] font-bold transition-opacity hover:opacity-80"
                          style={{ background: color }}
                        >
                          Learn more
                        </button>
                        <span className="text-[8px] text-gray-400 font-mono">
                          p={action.pAccept.toFixed(2)} · #{action.Rank}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Mock recommended roles list */
            <div className="bg-white rounded-lg p-3 shadow-sm border" style={{ borderColor: '#e5e7eb' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-gray-700">Recommended Roles</div>
                {nbaReady && <CDHBadge />}
              </div>
              {nbaReady ? (
                <div className="space-y-1.5">
                  {[
                    { name: persona.role, match: persona.id === 'james' ? 94 : persona.id === 'sarah' ? 83 : 87 },
                    { name: 'Similar role 2', match: 71 },
                    { name: 'Similar role 3', match: 64 },
                  ].map(({ name, match }) => (
                    <div key={name} className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-700">{name}</span>
                      <span className="font-bold px-1.5 py-0.5 rounded text-white text-[9px]" style={{ background: color }}>{match}% match</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="animate-pulse space-y-1.5">
                  {[1, 2, 3].map(i => <div key={i} className="h-4 bg-gray-100 rounded" />)}
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-lg p-3 shadow-sm border" style={{ borderColor: '#e5e7eb' }}>
            <div className="text-[10px] font-bold text-gray-500 mb-1">ENGAGEMENT WIDGET · Pega</div>
            {nbaReady ? (
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">
                  {persona.id === 'james' ? 'REME Skills Quiz — Q8 of 10' : persona.id === 'sarah' ? 'Officer Insight Event · Virtual' : 'Aircraft Tech Career Video'}
                </div>
                <div className="text-[10px] text-green-600">
                  {persona.id === 'james' ? '✓ Score 9/10 · Top 12%' : persona.id === 'sarah' ? '287 confirmed · Reserve your place' : '90% watched · CDH signal captured'}
                </div>
              </div>
            ) : (
              <div className="h-8 bg-gray-100 rounded animate-pulse" />
            )}
          </div>
        </div>

        {/* NBA sidebar */}
        <div className="space-y-2">
          <div className="bg-white rounded-lg p-2.5 shadow-sm border" style={{ borderColor: nbaReady ? color : '#e5e7eb', borderWidth: nbaReady ? 1.5 : 1 }}>
            <div className="text-[9px] font-bold text-gray-500 mb-1">CDH NEXT BEST ACTION</div>
            {nbaReady ? (
              <>
                <div className="text-[10px] font-semibold text-gray-800 leading-snug mb-1.5">{topAction.ActionName}</div>
                <div className="h-1 rounded-full overflow-hidden bg-gray-100 mb-1">
                  <div className="h-full rounded-full" style={{ width: `${(topAction.pAccept * 100).toFixed(0)}%`, background: color }} />
                </div>
                <div className="text-[9px] text-gray-400 font-mono">{(topAction.pAccept * 100).toFixed(0)}% pAccept</div>
                <button
                  onClick={onCtaClick}
                  disabled={capturing || captured}
                  className="w-full mt-2 py-1.5 rounded-lg text-white text-[10px] font-bold"
                  style={{ background: captured ? '#22c55e' : capturing ? '#94a3b8' : color }}
                >
                  {captured ? '✓ Captured' : capturing ? 'Firing…' : persona.id === 'james' ? 'Book AFCO →' : persona.id === 'sarah' ? 'Reserve place →' : 'Start application →'}
                </button>
              </>
            ) : (
              <div className="animate-pulse space-y-1">
                <div className="h-3 bg-gray-100 rounded" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg p-2.5 shadow-sm border text-[9px] text-gray-500" style={{ borderColor: '#e5e7eb' }}>
            <div className="font-bold mb-1">Policy gate</div>
            {['Eligible', 'Consented', 'Fatigue PASS', 'D&I 0.91'].map(c => (
              <div key={c} className="text-green-600">✓ {c}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Application portal (Stages 3–5) ──────────────────────────────────────────
function AppPortal({ stage, persona, nbaReady, onCtaClick, capturing, captured }: Props) {
  const color = serviceColor[persona.service];
  const topAction = stage.actions[0];
  const steps = persona.id === 'sarah' ? 9 : 7;
  const currentStep = stage.id === 3 ? 1 : stage.id === 4 ? 2 : 3;
  return (
    <div className="min-h-[420px]" style={{ background: '#f9fafb' }}>
      {/* Portal header */}
      <div className="px-4 py-2 flex items-center gap-3 shadow-sm text-xs" style={{ background: color }}>
        <span className="text-white font-bold">{serviceName[persona.service]} · Candidate Portal</span>
        <span className="ml-auto text-white/70">{persona.name} · {persona.caseId}</span>
      </div>

      {/* Step progress */}
      <div className="px-4 py-2 bg-white border-b shadow-sm" style={{ borderColor: '#e5e7eb' }}>
        <div className="flex items-center gap-0">
          {Array.from({ length: steps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white"
                style={{ background: i < currentStep ? color : i === currentStep ? '#006dcc' : '#d1d5db' }}
              >
                {i + 1}
              </div>
              {i < steps - 1 && (
                <div className="w-6 h-0.5" style={{ background: i < currentStep ? color : '#d1d5db' }} />
              )}
            </div>
          ))}
          <span className="ml-3 text-[10px] text-gray-500">Step {currentStep} of {steps}</span>
        </div>
      </div>

      <div className="p-3 grid grid-cols-3 gap-3">
        {/* Main form area */}
        <div className="col-span-2 space-y-2">
          {/* Context loaded banner */}
          {nbaReady && (
            <div className="rounded-lg p-2.5 slide-in text-[10px]" style={{ background: `${color}10`, border: `1px solid ${color}30` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-600 font-bold">✓ Prior context pre-loaded by CDH</span>
                <CDHBadge />
              </div>
              {['Engagement history', 'Skills / quiz signals', 'Service preference'].map(c => (
                <div key={c} className="text-green-600">✓ {c}</div>
              ))}
            </div>
          )}

          {/* Form fields */}
          <div className="bg-white rounded-lg p-3 shadow-sm border" style={{ borderColor: '#e5e7eb' }}>
            <div className="text-xs font-bold text-gray-700 mb-2">
              {stage.id === 3 ? 'Personal Details' : stage.id === 4 ? 'Medical History' : 'Pre-Interview Checklist'}
            </div>
            <div className="space-y-2">
              {[
                stage.id === 3 ? ['Full name', 'James Thompson'] : stage.id === 4 ? ['Condition (if any)', 'Asthma — resolved age 12'] : ['BARB score', '87'],
                stage.id === 3 ? ['Date of birth', '14/03/2002'] : stage.id === 4 ? ['Medication', 'None'] : ['Preferred trade', persona.role],
                stage.id === 3 ? ['Address', 'Carlisle, CA1'] : stage.id === 4 ? ['Vision', '6/6 unaided'] : ['Interview date', 'Confirmed'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-2 text-[10px]">
                  <span className="w-28 text-gray-500 flex-shrink-0">{label}</span>
                  <div className="flex-1 bg-gray-50 rounded px-2 py-1 text-gray-800 font-medium border" style={{ borderColor: '#e5e7eb' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={onCtaClick}
            disabled={!nbaReady || capturing || captured}
            className="w-full py-2 rounded-lg text-white text-xs font-bold transition-all"
            style={{ background: captured ? '#22c55e' : capturing ? '#94a3b8' : nbaReady ? color : '#d1d5db' }}
          >
            {captured ? '✓ Step submitted — next NBA queued' : capturing ? 'Firing capture API…' : `Continue to Step ${currentStep + 1} →`}
          </button>
        </div>

        {/* NBA sidebar */}
        <div className="space-y-2">
          {nbaReady && (
            <div className="bg-white rounded-lg p-2.5 shadow-sm border slide-in" style={{ borderColor: color }}>
              <div className="text-[9px] font-bold mb-1" style={{ color }}>CDH NEXT BEST STEP</div>
              <div className="text-[10px] text-gray-700 font-semibold leading-snug mb-1">{topAction.ActionName}</div>
              <div className="mt-1.5 h-1 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(topAction.pAccept * 100).toFixed(0)}%`, background: color }} />
              </div>
              <div className="text-[9px] text-gray-400 mt-0.5 font-mono">{(topAction.pAccept * 100).toFixed(0)}% pAccept · Rank 1</div>
            </div>
          )}
          <div className="bg-white rounded-lg p-2.5 shadow-sm border text-[9px]" style={{ borderColor: '#e5e7eb' }}>
            <div className="font-bold text-gray-600 mb-1">Merit rank</div>
            <div className="text-lg font-black" style={{ color }}>
              {persona.id === 'james' ? '7' : persona.id === 'sarah' ? '3' : '12'}
              <span className="text-[10px] text-gray-400 font-normal"> of {persona.id === 'james' ? '32' : persona.id === 'sarah' ? '18' : '44'}</span>
            </div>
            <div className="text-green-600 mt-1">SLA 10-day · on track ✓</div>
          </div>
          <div className="bg-white rounded-lg p-2.5 shadow-sm border text-[9px] text-gray-500" style={{ borderColor: '#e5e7eb' }}>
            <div className="font-bold text-gray-600 mb-1">ATRS audit</div>
            <div className="font-mono text-[8px] break-all">ATRS-2026-CAP-00{stage.id}-{persona.avatar}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Assessment / Medical / Vetting / AC (Stages 6–11) ────────────────────────
function AssessmentPortal({ stage, persona, nbaReady, onCtaClick, capturing, captured }: Props) {
  const color = serviceColor[persona.service];
  const topAction = stage.actions[0];
  return (
    <div className="min-h-[420px]" style={{ background: '#f9fafb' }}>
      <div className="px-4 py-2 flex items-center gap-3 shadow-sm text-xs" style={{ background: color }}>
        <span className="text-white font-bold">{serviceName[persona.service]} · {stage.name}</span>
        <span className="ml-auto text-white/70">{persona.name} · {stage.dayRange}</span>
      </div>

      <div className="p-3 grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-2">
          {/* Status card */}
          {nbaReady ? (
            <div className="bg-white rounded-lg p-3 shadow-sm border slide-in" style={{ borderColor: color }}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-gray-700">{stage.name} Status</div>
                <CDHBadge label="CDH CONTEXT" />
              </div>
              {stage.signals.slice(-4).map((s, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b text-[10px]" style={{ borderColor: '#f3f4f6' }}>
                  <span className="text-gray-500">{s.signal.replace(/_/g, ' ')}</span>
                  <span className="font-semibold text-gray-800">{String(s.value).replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-3 shadow-sm border animate-pulse" style={{ borderColor: '#e5e7eb' }}>
              <div className="space-y-2">{[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-gray-100 rounded" />)}</div>
            </div>
          )}

          {/* Outcome */}
          {nbaReady && stage.outcome && (
            <div className="rounded-lg p-2.5 slide-in" style={{ background: '#22c55e12', border: '1px solid #22c55e30' }}>
              <div className="text-green-700 text-xs font-bold">✓ Outcome: {stage.outcome}</div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={onCtaClick}
            disabled={!nbaReady || capturing || captured}
            className="w-full py-2 rounded-lg text-white text-xs font-bold transition-all"
            style={{ background: captured ? '#22c55e' : capturing ? '#94a3b8' : nbaReady ? color : '#d1d5db' }}
          >
            {captured ? '✓ Interaction captured — next NBA queued' : capturing ? 'Firing capture API…' : `Confirm ${stage.shortName} →`}
          </button>
        </div>

        <div className="space-y-2">
          {nbaReady && (
            <div className="bg-white rounded-lg p-2.5 shadow-sm border slide-in" style={{ borderColor: color }}>
              <div className="text-[9px] font-bold mb-1" style={{ color }}>CDH NEXT BEST STEP</div>
              <div className="text-[10px] text-gray-700 font-semibold leading-snug mb-1">{topAction.ActionName}</div>
              <div className="h-1 rounded-full bg-gray-100 overflow-hidden mt-1.5">
                <div className="h-full rounded-full" style={{ width: `${(topAction.pAccept * 100).toFixed(0)}%`, background: color }} />
              </div>
              <div className="text-[9px] text-gray-400 mt-0.5 font-mono">{(topAction.pAccept * 100).toFixed(0)}% pAccept</div>
            </div>
          )}
          <div className="bg-white rounded-lg p-2.5 shadow-sm border text-[9px] text-gray-500" style={{ borderColor: '#e5e7eb' }}>
            <div className="font-bold text-gray-600 mb-1">All actions ({stage.actions.length})</div>
            {stage.actions.map((a, i) => (
              <div key={a.ActionID} className="flex items-center gap-1 py-0.5">
                <span className="w-3 h-3 rounded-full text-[7px] text-white flex items-center justify-center font-black flex-shrink-0" style={{ background: i === 0 ? color : '#9ca3af' }}>{i + 1}</span>
                <span className="truncate">{a.ActionName.split(' ').slice(0, 4).join(' ')}</span>
                <span className="ml-auto font-mono text-[8px]">{(a.pAccept * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Offer / Training portal (Stages 12–13) ────────────────────────────────────
function OfferPortal({ stage, persona, nbaReady, onCtaClick, capturing, captured }: Props) {
  const color = serviceColor[persona.service];
  const topAction = stage.actions[0];
  return (
    <div className="min-h-[420px]" style={{ background: '#f9fafb' }}>
      <div className="px-4 py-2 flex items-center gap-3 shadow-sm text-xs" style={{ background: color }}>
        <span className="text-white font-bold">{serviceName[persona.service]} · {stage.name}</span>
        <span className="ml-auto text-white/70">{persona.name} · {stage.dayRange}</span>
      </div>

      <div className="p-4 space-y-3">
        {/* Offer letter / training header */}
        {nbaReady ? (
          <div className="bg-white rounded-xl p-4 shadow-sm border slide-in" style={{ borderColor: color }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-lg font-black text-gray-800">
                  {stage.id === 12 ? 'Offer of Service' : 'Phase 1 Training — Welcome'}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {persona.role} · {stage.dayRange}
                </div>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <CDHBadge label="CDH ORCHESTRATED" />
              </div>
            </div>
            <div className="space-y-2">
              {stage.signals.slice(-4).map((s, i) => (
                <div key={i} className="flex justify-between text-xs py-1.5 border-b" style={{ borderColor: '#f3f4f6' }}>
                  <span className="text-gray-500">{s.signal.replace(/_/g, ' ')}</span>
                  <span className="font-semibold text-gray-800">{String(s.value).replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
            {stage.outcome && (
              <div className="mt-3 rounded-lg p-2 text-center text-xs font-bold text-green-700" style={{ background: '#22c55e12', border: '1px solid #22c55e30' }}>
                ✓ {stage.outcome}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-4 shadow-sm border animate-pulse" style={{ borderColor: '#e5e7eb' }}>
            <div className="h-6 bg-gray-100 rounded w-1/2 mb-3" />
            <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-4 bg-gray-100 rounded" />)}</div>
          </div>
        )}

        {/* Next best step */}
        {nbaReady && (
          <div className="bg-white rounded-xl p-3 shadow-sm border slide-in" style={{ borderColor: `${color}60` }}>
            <div className="text-[9px] font-bold mb-1" style={{ color }}>CDH NEXT BEST ACTION · POST-{stage.id === 12 ? 'OFFER' : 'ENLIST'}</div>
            <div className="text-xs font-semibold text-gray-800 mb-2">{topAction.ActionName}</div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-1">
              <div className="h-full rounded-full" style={{ width: `${(topAction.pAccept * 100).toFixed(0)}%`, background: color }} />
            </div>
            <div className="text-[9px] text-gray-400 font-mono mb-2">{(topAction.pAccept * 100).toFixed(0)}% pAccept · {topAction.Channel}</div>
            <button
              onClick={onCtaClick}
              disabled={capturing || captured}
              className="w-full py-2 rounded-lg text-white text-xs font-bold transition-all"
              style={{ background: captured ? '#22c55e' : capturing ? '#94a3b8' : color }}
            >
              {captured ? '✓ Interaction captured' : capturing ? 'Firing capture API…' : stage.id === 12 ? 'Accept Offer & Sign →' : 'Download Joining Pack →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function WebPortal(props: Props) {
  const { stage } = props;

  const content = stage.id === 1
    ? <SocialDesktop {...props} />
    : stage.id === 2
    ? <CareersWebsite {...props} />
    : stage.id <= 5
    ? <AppPortal {...props} />
    : stage.id <= 11
    ? <AssessmentPortal {...props} />
    : <OfferPortal {...props} />;

  const tabTitle = stage.id === 1
    ? `${props.platform.label} · Sponsored`
    : stage.id <= 5
    ? `${serviceName[props.persona.service]} · ${stage.shortName}`
    : `${stage.name} · ${props.persona.name}`;

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{ border: '1px solid #1e293b', background: '#0f172a', minHeight: 480 }}
    >
      {/* Browser chrome */}
      <div className="bg-slate-800 px-3 pt-2 pb-0">
        {/* Traffic lights + tab */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-t-md text-[10px]"
            style={{ background: '#f9fafb', color: '#374151' }}
          >
            <div className="w-3 h-3 rounded-sm flex items-center justify-center text-[8px]"
              style={{ background: serviceColor[props.persona.service] }}>
              <span className="text-white">{props.persona.avatar}</span>
            </div>
            <span className="truncate max-w-[160px]">{tabTitle}</span>
          </div>
        </div>
      </div>
      {/* Address bar */}
      <div className="bg-slate-700 px-3 py-1.5 flex items-center gap-2">
        <div className="flex gap-1 text-slate-400 text-xs">
          <span>←</span>
          <span>→</span>
          <span>↺</span>
        </div>
        <div className="flex-1 bg-slate-900 rounded-full px-3 py-0.5 flex items-center gap-1.5">
          <Lock size={9} className="text-green-400" />
          <span className="text-slate-400 text-[10px] font-mono truncate">{stage.pageURL}</span>
        </div>
        {props.nbaReady && (
          <div className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: '#006dcc20', color: '#00c2ff', border: '1px solid #006dcc40' }}>
            CDH ⚡
          </div>
        )}
      </div>
      {/* Page content */}
      <div className="flex-1 overflow-auto">
        {content}
      </div>
    </div>
  );
}

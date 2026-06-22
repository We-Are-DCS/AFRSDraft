/**
 * CDHApiPanel — right-hand API inspector + live CDH configuration.
 *
 * Tabs:
 *   ⚙ Config   — endpoint URL, auth, container, CORS proxy, live toggle
 *   → Request  — the JSON body to be sent (editable in live mode)
 *   ← Response — CDH response (live JSON or simulated mock)
 *   🎯 NBA     — ranked actions from response (LIVE / MOCK badge)
 *   📡 Capture — capture interaction call + response
 *
 * When live mode is ON, the Config / Request tabs let the user edit and
 * re-send the call. The returned NBA actions are injected into effectiveStage
 * by App.tsx so SimpleMobile and WebPortal render CDH-live content.
 */

import { useEffect, useState, useCallback } from 'react';
import { Settings, Target, Compass, Radio, AlertTriangle } from 'lucide-react';
import type { StageConfig } from '../data/cdh';
import type { Persona } from '../data/types';
import type { CaptureRequest, CaptureResponse } from '../data/captureApi';
import type { CDHConfig } from '../hooks/useCDHConfig';
import type { LiveCallState } from '../hooks/useCDHLiveCall';

// ── Props ──────────────────────────────────────────────────────────────────────
interface Props {
  stage: StageConfig;
  persona: Persona;
  onNBAReady: () => void;
  captureRequest: CaptureRequest | null;
  captureResponse: CaptureResponse | null;
  // CDH live config (owned by App.tsx via useCDHConfig)
  config: CDHConfig;
  onConfigChange: (patch: Partial<CDHConfig>) => void;
  onConfigReset: () => void;
  // Live call state (owned by App.tsx via useCDHLiveCall)
  liveState: LiveCallState;
  onManualCall: (body?: Record<string, unknown>) => Promise<void>;
  buildRequestBody: () => Record<string, unknown>;
}

type ApiTab = 'config' | 'request' | 'response' | 'nba' | 'capture' | 'ops';
type ApiState = 'idle' | 'requesting' | 'processing' | 'responded' | 'rendered';

// ── Helpers ────────────────────────────────────────────────────────────────────
function JsonBlock({ data, highlights = [] }: { data: object; highlights?: string[] }) {
  const json = JSON.stringify(data, null, 2);
  return (
    <pre className="text-[10px] font-mono leading-relaxed overflow-auto max-h-64 text-slate-300 whitespace-pre-wrap">
      {json.split('\n').map((line, i) => {
        const isHit = highlights.some((h) => line.includes(h));
        return (
          <span key={i} className={isHit ? 'text-yellow-300 font-bold' : ''}>
            {line}{'\n'}
          </span>
        );
      })}
    </pre>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">{children}</div>
  );
}

function Input({
  value, onChange, placeholder, type = 'text', className = '',
}: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-1.5 text-[11px] font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-500 transition-colors ${className}`}
    />
  );
}

// ── Badge: LIVE or MOCK ────────────────────────────────────────────────────────
function ModeBadge({ mode }: { mode: 'live' | 'mock' }) {
  return mode === 'live' ? (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#22c55e20', color: '#22c55e', border: '1px solid #22c55e40' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      LIVE
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#475569', color: '#94a3b8', border: '1px solid #334155' }}>
      MOCK
    </span>
  );
}

const PEGA_CDH_BASE = 'https://pega-cdh.afrs.mod.uk/prweb/api/v1';

// ── Main component ─────────────────────────────────────────────────────────────
export default function CDHApiPanel({
  stage, persona, onNBAReady, captureRequest, captureResponse,
  config, onConfigChange, onConfigReset, liveState, onManualCall, buildRequestBody,
}: Props) {
  // Mock pipeline animation state (used when not in live mode)
  const [apiState, setApiState] = useState<ApiState>('idle');
  const [latencyMs] = useState(() => 110 + Math.floor(Math.random() * 90));
  const [activeTab, setActiveTab] = useState<ApiTab>('request');

  // Editable request body (JSON string in the Request tab)
  const [editableBody, setEditableBody] = useState('');
  const [bodyError, setBodyError] = useState('');

  // Reset editable body whenever stage / persona changes
  useEffect(() => {
    setEditableBody(JSON.stringify(buildRequestBody(), null, 2));
    setBodyError('');
  }, [stage.id, persona.id, config.useStageContainer, config.containerOverride]);

  // ── Mock pipeline animation (fires when NOT in live mode) ──────────────────
  useEffect(() => {
    if (config.enabled) return; // live mode drives its own state
    setApiState('idle');
    setActiveTab('request');
    const t1 = setTimeout(() => setApiState('requesting'), 350);
    const t2 = setTimeout(() => setApiState('processing'), 800);
    const t3 = setTimeout(() => { setApiState('responded'); setActiveTab('response'); }, 800 + latencyMs);
    const t4 = setTimeout(() => { setApiState('rendered'); setActiveTab('nba'); onNBAReady(); }, 800 + latencyMs + 550);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [stage.id, persona.id, config.enabled]);

  // ── Live mode: switch tabs as live call progresses ──────────────────────────
  useEffect(() => {
    if (!config.enabled) return;
    if (liveState.loading) { setActiveTab('request'); return; }
    if (liveState.error) { setActiveTab('response'); return; }
    if (liveState.liveActions) { setActiveTab('nba'); }
  }, [config.enabled, liveState.loading, liveState.error, liveState.liveActions]);

  // ── Auto-switch to capture tab ──────────────────────────────────────────────
  useEffect(() => {
    if (captureResponse) setActiveTab('capture');
  }, [captureResponse]);

  // ── Derived display values ──────────────────────────────────────────────────
  const isLive = config.enabled;
  const effectiveApiState: ApiState = isLive
    ? liveState.loading ? 'processing'
      : liveState.liveActions ? 'rendered'
      : liveState.error ? 'responded'
      : 'idle'
    : apiState;

  const displayLatency = isLive ? liveState.latencyMs : latencyMs;

  // ── Mock request/response bodies (used when live mode is off) ───────────────
  const mockRequestBody = {
    DecisioningContext: {
      Channel: stage.channel, Direction: 'INBOUND',
      ContainerName: stage.containerName, Touchpoint: stage.touchpoint,
    },
    CustomerProfile: {
      CustomerID: persona.caseId, Service: persona.service.toUpperCase(),
      RolePreference: persona.role, SignalCount: stage.signals.length,
      PropensityScore: stage.propensity / 100,
    },
    Context: {
      PageURL: stage.pageURL,
      SessionID: `SID-${persona.caseId}-${stage.id}`,
      Timestamp: new Date().toISOString(),
    },
  };

  const mockResponseBody = {
    status: 200, latencyMs,
    ContainerName: stage.containerName, CustomerID: persona.caseId,
    AdaptiveModelScore: stage.adaptiveScore / 100, PropensityScore: stage.propensity / 100,
    EngagementPolicyResult: {
      Eligible: true, Consented: true, FatigueCheck: 'PASS', DisparityRatio: 0.91,
      ATRSRef: `ATRS-2026-${String(stage.id).padStart(3, '0')}-${persona.avatar}`,
    },
    Actions: stage.actions.map((a) => ({
      ActionID: a.ActionID, ActionName: a.ActionName, Treatment: a.Treatment,
      Channel: a.Channel, pAccept: a.pAccept, pValue: a.pValue, Rank: a.Rank,
      ...(a.ContentFragmentID ? { ContentFragmentID: a.ContentFragmentID } : {}),
      ...(a.AudienceSegment ? { AudienceSegment: a.AudienceSegment } : {}),
    })),
  };

  const displayActions = isLive && liveState.liveActions ? liveState.liveActions : stage.actions;
  const displayRequest = isLive && liveState.rawRequest ? liveState.rawRequest : mockRequestBody;
  const displayResponse = isLive && liveState.rawResponse ? liveState.rawResponse : mockResponseBody;
  const responseReady = isLive ? !!liveState.rawResponse || !!liveState.error : effectiveApiState === 'responded' || effectiveApiState === 'rendered';
  const nbaReady = isLive ? !!liveState.liveActions : effectiveApiState === 'rendered';

  // ── Manual send (live mode, editable body) ──────────────────────────────────
  const handleSend = useCallback(() => {
    try {
      const parsed = JSON.parse(editableBody) as Record<string, unknown>;
      setBodyError('');
      void onManualCall(parsed);
    } catch {
      setBodyError('Invalid JSON — fix the syntax before sending');
    }
  }, [editableBody, onManualCall]);

  // ── Tab definitions ─────────────────────────────────────────────────────────
  const tabs: { id: ApiTab; icon: React.ReactNode; label: string; disabled: boolean; highlight?: boolean; dot?: string }[] = [
    { id: 'config',   icon: <Settings size={10} />,     label: 'Config',   disabled: false, dot: isLive ? '#22c55e' : undefined },
    { id: 'request',  icon: <span className="text-[9px]">→</span>, label: 'Request',  disabled: false },
    { id: 'response', icon: <span className="text-[9px]">←</span>, label: 'Response', disabled: !responseReady },
    { id: 'nba',      icon: <Target size={10} />,       label: 'NBA',      disabled: !nbaReady },
    { id: 'ops',      icon: <Compass size={10} />,      label: 'Ops',      disabled: !nbaReady },
    { id: 'capture',  icon: <Radio size={10} />,        label: 'Capture',  disabled: !captureRequest, highlight: !!captureResponse },
  ];

  return (
    <div className="flex flex-col gap-3">

      {/* ── Status bar ─────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CDH Real-Time Container API</div>
            <ModeBadge mode={isLive && !liveState.error ? 'live' : 'mock'} />
          </div>
          <div className="flex items-center gap-2">
            {displayLatency !== null && (effectiveApiState === 'responded' || effectiveApiState === 'rendered') && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: '#00c2ff15', color: '#00c2ff' }}>
                {displayLatency}ms
              </span>
            )}
          </div>
        </div>

        {/* Endpoint pill */}
        <div className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2 font-mono text-[11px] mb-2">
          <span className="text-green-400 font-bold">POST</span>
          <span className="text-slate-500 truncate">{isLive ? config.baseUrl : PEGA_CDH_BASE}/</span>
          <span className="text-cyan-300 font-semibold flex-shrink-0">real-time-container</span>
        </div>
        <div className="text-[9px] font-mono text-slate-700 mb-3 truncate">
          Container: {config.useStageContainer ? stage.containerName : (config.containerOverride || stage.containerName)}
          {isLive && config.authType !== 'none' && ` · Auth: ${config.authType}`}
        </div>

        {/* Capture sub-bar */}
        {captureRequest && (
          <div className="mt-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2 font-mono text-[11px]">
              <span className="text-orange-400 font-bold">POST</span>
              <span className="text-slate-500">{isLive ? config.baseUrl : PEGA_CDH_BASE}/</span>
              <span className="text-orange-300 font-semibold">interactions/capture</span>
              {captureResponse && <span className="ml-auto text-green-400 font-bold text-[10px]">200 OK ✓</span>}
            </div>
          </div>
        )}
      </div>

      {/* ── Tabs panel ─────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl flex flex-col overflow-hidden">

        {/* Tab row */}
        <div className="flex gap-px border-b border-slate-800 overflow-x-auto">
          {tabs.map(({ id, icon, label, disabled, highlight, dot }) => (
            <button
              key={id}
              onClick={() => !disabled && setActiveTab(id)}
              disabled={disabled}
              className="flex-shrink-0 flex-1 min-w-0 px-2 py-2.5 text-[10px] font-semibold transition-all duration-150 border-b-2 relative"
              style={{
                borderColor: activeTab === id ? persona.color : 'transparent',
                color: activeTab === id ? 'white' : disabled ? '#1e293b' : '#64748b',
                background: activeTab === id ? `${persona.color}11` : 'transparent',
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              <span className="flex items-center justify-center gap-1">{icon}{label}</span>
              {dot && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: dot }} />
              )}
              {highlight && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-4 overflow-auto max-h-[520px]">

          {/* ── ⚙ Config tab ────────────────────────────────────────────────── */}
          {activeTab === 'config' && (
            <div className="space-y-4">

              {/* Live mode toggle — prominent */}
              <div className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: isLive ? '#22c55e12' : '#33415520', border: `1px solid ${isLive ? '#22c55e40' : '#334155'}` }}>
                <div>
                  <div className="text-[11px] font-bold text-white">Live CDH Connection</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">
                    {isLive ? 'Calling real CDH endpoint — UI driven by live NBA data' : 'Using built-in mock data (stageConfigs)'}
                  </div>
                </div>
                <button
                  onClick={() => onConfigChange({ enabled: !isLive })}
                  className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
                  style={{ background: isLive ? '#22c55e' : '#334155' }}
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                    style={{ transform: isLive ? 'translateX(22px)' : 'translateX(2px)' }}
                  />
                </button>
              </div>

              {/* Base URL */}
              <div>
                <Label>Base URL</Label>
                <Input
                  value={config.baseUrl}
                  onChange={(v) => onConfigChange({ baseUrl: v })}
                  placeholder="https://your-pega.com/prweb/api/v1"
                />
                <div className="text-[9px] text-slate-600 mt-1">Endpoint up to /prweb/api/v1 — the hook appends /real-time-container/&#123;container&#125;</div>
              </div>

              {/* Auth */}
              <div>
                <Label>Authentication</Label>
                <div className="flex gap-2 mb-2">
                  {(['bearer', 'basic', 'none'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => onConfigChange({ authType: t })}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all"
                      style={{
                        background: config.authType === t ? `${persona.color}25` : '#1e293b',
                        color: config.authType === t ? persona.color : '#64748b',
                        border: `1px solid ${config.authType === t ? persona.color + '50' : '#334155'}`,
                      }}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
                {config.authType !== 'none' && (
                  <Input
                    value={config.authToken}
                    onChange={(v) => onConfigChange({ authToken: v })}
                    type="password"
                    placeholder={config.authType === 'bearer' ? 'your-bearer-token' : 'base64(username:password)'}
                  />
                )}
                {config.authType === 'basic' && (
                  <div className="text-[9px] text-slate-600 mt-1">Paste the base64-encoded value of username:password</div>
                )}
              </div>

              {/* Container name */}
              <div>
                <Label>CDH Container</Label>
                <div
                  className="flex items-center gap-2 p-2 rounded-lg mb-2 cursor-pointer"
                  style={{ background: '#1e293b', border: '1px solid #334155' }}
                  onClick={() => onConfigChange({ useStageContainer: !config.useStageContainer })}
                >
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: config.useStageContainer ? persona.color : 'transparent', border: `2px solid ${config.useStageContainer ? persona.color : '#475569'}` }}
                  >
                    {config.useStageContainer && <span className="text-white text-[9px] font-bold">✓</span>}
                  </div>
                  <div className="text-[10px] text-slate-400">Use stage container name</div>
                  {config.useStageContainer && (
                    <code className="ml-auto text-[9px] font-mono text-cyan-400 truncate max-w-[160px]">{stage.containerName}</code>
                  )}
                </div>
                {!config.useStageContainer && (
                  <Input
                    value={config.containerOverride}
                    onChange={(v) => onConfigChange({ containerOverride: v })}
                    placeholder="AFRS_ARMY_Attract_Container"
                  />
                )}
              </div>

              {/* CORS proxy */}
              <div>
                <Label>CORS Proxy <span className="normal-case font-normal text-slate-600">(optional)</span></Label>
                <Input
                  value={config.corsProxy}
                  onChange={(v) => onConfigChange({ corsProxy: v })}
                  placeholder="https://corsproxy.io/? (leave empty if CDH allows CORS)"
                />
                <div className="text-[9px] text-slate-600 mt-1">Prepended to the full request URL. Not needed if running inside the same network as CDH.</div>
              </div>

              {/* Error display */}
              {isLive && liveState.error && (
                <div className="p-3 rounded-xl" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                  <div className="text-[10px] font-bold text-red-400 mb-1 flex items-center gap-1"><AlertTriangle size={10} /> Last call failed</div>
                  <div className="text-[10px] font-mono text-red-300 break-all">{liveState.error}</div>
                  <div className="text-[9px] text-slate-500 mt-1.5">The UI is rendering mock data as fallback</div>
                </div>
              )}

              {/* Actions row */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => void onManualCall()}
                  disabled={!isLive || liveState.loading}
                  className="flex-1 py-2 rounded-lg text-[11px] font-bold transition-all disabled:opacity-40"
                  style={{ background: `${persona.color}25`, color: persona.color, border: `1px solid ${persona.color}50` }}
                >
                  ↑ Test Connection
                </button>
                <button
                  onClick={onConfigReset}
                  className="px-3 py-2 rounded-lg text-[11px] text-slate-500 transition-all hover:text-slate-300"
                  style={{ background: '#1e293b', border: '1px solid #334155' }}
                >
                  ↺ Reset
                </button>
              </div>

              {/* Success status */}
              {isLive && liveState.liveActions && !liveState.error && (
                <div className="p-2 rounded-lg flex items-center gap-2" style={{ background: '#22c55e12', border: '1px solid #22c55e30' }}>
                  <span className="text-green-400 text-xs">✓</span>
                  <div className="text-[10px] text-green-300">
                    Connected · {liveState.liveActions.length} action{liveState.liveActions.length !== 1 ? 's' : ''} returned
                    {liveState.latencyMs !== null ? ` · ${liveState.latencyMs}ms` : ''}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── → Request tab ───────────────────────────────────────────────── */}
          {activeTab === 'request' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[9px] text-slate-600 font-mono">
                  {isLive ? `// POST ${config.baseUrl}/real-time-container` : `// POST ${PEGA_CDH_BASE}/real-time-container`}
                </div>
                <ModeBadge mode={isLive ? 'live' : 'mock'} />
              </div>

              {isLive ? (
                /* Editable textarea in live mode */
                <div>
                  <textarea
                    value={editableBody}
                    onChange={(e) => {
                      setEditableBody(e.target.value);
                      setBodyError('');
                    }}
                    rows={16}
                    spellCheck={false}
                    className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[10px] font-mono text-slate-300 resize-none focus:outline-none transition-colors"
                    style={{ borderColor: bodyError ? '#ef4444' : '#334155' }}
                  />
                  {bodyError && (
                    <div className="text-[9px] text-red-400 mt-1">{bodyError}</div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleSend}
                      disabled={liveState.loading}
                      className="flex-1 py-2 rounded-lg text-[11px] font-bold transition-all disabled:opacity-40"
                      style={{ background: `${persona.color}25`, color: persona.color, border: `1px solid ${persona.color}50` }}
                    >
                      ↑ Send to CDH
                    </button>
                    <button
                      onClick={() => setEditableBody(JSON.stringify(buildRequestBody(), null, 2))}
                      className="px-3 py-2 rounded-lg text-[11px] text-slate-400 transition-all hover:text-slate-200"
                      style={{ background: '#1e293b', border: '1px solid #334155' }}
                    >
                      ↺ Reset body
                    </button>
                  </div>
                </div>
              ) : (
                /* Read-only view in mock mode */
                <JsonBlock data={displayRequest} highlights={['ContainerName', 'CustomerID']} />
              )}
            </div>
          )}

          {/* ── ← Response tab ──────────────────────────────────────────────── */}
          {activeTab === 'response' && responseReady && (
            <div className="slide-in">
              <div className="flex items-center gap-2 mb-2 text-[9px] font-mono">
                {isLive && liveState.error ? (
                  <span className="text-red-400 font-bold">ERROR</span>
                ) : (
                  <span className="text-green-400 font-bold">200 OK</span>
                )}
                {displayLatency !== null && (
                  <span className="text-cyan-400">{displayLatency}ms</span>
                )}
                <span className="text-slate-600">· {displayActions.length} actions</span>
                <span className="ml-auto"><ModeBadge mode={isLive && !!liveState.rawResponse ? 'live' : 'mock'} /></span>
              </div>

              {isLive && liveState.error ? (
                <div className="p-3 rounded-xl" style={{ background: '#ef444412', border: '1px solid #ef444435' }}>
                  <div className="text-[10px] font-mono text-red-300 break-all">{liveState.error}</div>
                </div>
              ) : (
                <JsonBlock data={displayResponse} highlights={['pAccept', 'ActionID', 'Treatment']} />
              )}
            </div>
          )}

          {/* ── 🎯 NBA Output tab ───────────────────────────────────────────── */}
          {activeTab === 'nba' && nbaReady && (
            <div className="slide-in space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[9px] text-slate-600 font-mono">
                  // Ranked actions → {stage.touchpoint.replace(/_/g, ' ')}
                </div>
                <ModeBadge mode={isLive && !!liveState.liveActions ? 'live' : 'mock'} />
              </div>

              {displayActions.map((action, i) => (
                <div
                  key={action.ActionID}
                  className="rounded-xl p-3"
                  style={{
                    background: i === 0 ? `${persona.color}18` : 'rgba(30,41,59,0.5)',
                    border: `1px solid ${i === 0 ? persona.color + '40' : '#1e293b'}`,
                  }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 text-white"
                      style={{ background: i === 0 ? persona.color : '#334155' }}
                    >
                      {action.Rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-[11px] font-semibold leading-tight">{action.ActionName}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{action.Treatment}</span>
                        <span className="text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded inline-flex items-center gap-1"><Radio size={8} />{action.Channel}</span>
                        {isLive && liveState.liveActions && i === 0 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#22c55e20', color: '#22c55e' }}>LIVE</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-black text-sm" style={{ color: i === 0 ? persona.color : '#475569' }}>
                        {(action.pAccept * 100).toFixed(0)}%
                      </div>
                      <div className="text-[9px] text-slate-600">pAccept</div>
                    </div>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${action.pAccept * 100}%`, background: i === 0 ? persona.color : '#475569' }}
                    />
                  </div>
                </div>
              ))}

              {isLive && liveState.liveActions && (
                <div className="p-2 rounded-lg text-[9px] text-green-400 font-mono" style={{ background: '#22c55e0a', border: '1px solid #22c55e20' }}>
                  ✓ NBA data sourced from live CDH endpoint · {displayLatency}ms
                </div>
              )}
            </div>
          )}

          {/* ── 🧭 Ops Manager tab ──────────────────────────────────────────── */}
          {activeTab === 'ops' && nbaReady && (
            <div className="slide-in space-y-4">

              {/* Container + policy summary */}
              <div className="rounded-xl p-3" style={{ background: `${persona.color}0f`, border: `1px solid ${persona.color}25` }}>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Active Container</div>
                <div className="font-mono text-[11px] text-cyan-300 break-all">
                  {config.useStageContainer ? stage.containerName : (config.containerOverride || stage.containerName)}
                </div>
                <div className="flex gap-2 mt-2 text-[9px]">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{stage.channel}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{stage.touchpoint.replace(/_/g, ' ')}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">INBOUND</span>
                </div>
              </div>

              {/* Policy gates */}
              <div>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Engagement Policy</div>
                <div className="space-y-1.5">
                  {[
                    { label: 'Eligible',       value: 'PASS', detail: 'Candidate meets service & role criteria' },
                    { label: 'Consented',       value: 'PASS', detail: 'Data consent recorded in AFRS' },
                    { label: 'Fatigue check',   value: 'PASS', detail: 'Within contact frequency limits' },
                    { label: 'D&I Disparity',   value: '0.91', detail: 'Above 0.85 threshold — ATRS audited' },
                  ].map((g) => (
                    <div key={g.label} className="flex items-center gap-2 p-2 rounded-lg"
                      style={{ background: '#22c55e08', border: '1px solid #22c55e20' }}>
                      <span className="text-green-400 text-xs flex-shrink-0">✓</span>
                      <span className="text-[10px] text-white font-semibold flex-shrink-0 w-28">{g.label}</span>
                      <span className="text-[9px] font-mono text-green-300 flex-shrink-0">{g.value}</span>
                      <span className="text-[9px] text-slate-600 truncate">{g.detail}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-1.5 text-[9px] font-mono text-slate-700">
                  ATRS-2026-{String(stage.id).padStart(3, '0')}-{persona.avatar}
                </div>
              </div>

              {/* Decision reasoning per action */}
              <div>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Why Each Action Was Ranked
                </div>
                <div className="space-y-2">
                  {displayActions.map((action, i) => {
                    const reasons = [
                      `pAccept ${(action.pAccept * 100).toFixed(0)}% — adaptive model score`,
                      action.AudienceSegment ? `Segment match: ${action.AudienceSegment}` : 'Segment: general',
                      `Treatment ${action.Treatment} selected by arbitration`,
                      i === 0 ? 'Highest expected value — served to candidate' : `Suppressed — lower rank than action ${i}`,
                    ];
                    return (
                      <div
                        key={action.ActionID}
                        className="rounded-xl p-3"
                        style={{
                          background: i === 0 ? `${persona.color}10` : 'rgba(15,23,42,0.6)',
                          border: `1px solid ${i === 0 ? persona.color + '30' : '#1e293b'}`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                            style={{ background: i === 0 ? persona.color : '#334155' }}
                          >{action.Rank}</span>
                          <span className="text-[11px] font-semibold text-white truncate">{action.ActionName}</span>
                          <span className="ml-auto text-[10px] font-bold flex-shrink-0" style={{ color: i === 0 ? persona.color : '#475569' }}>
                            {(action.pAccept * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          {reasons.map((r) => (
                            <div key={r} className="text-[9px] text-slate-500 flex gap-1.5">
                              <span className="text-slate-700 flex-shrink-0">·</span>
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Propensity + adaptive scores */}
              <div className="rounded-xl p-3 bg-slate-950" style={{ border: '1px solid #1e293b' }}>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Model Scores</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Propensity', value: stage.propensity, color: persona.color },
                    { label: 'Adaptive',   value: stage.adaptiveScore, color: '#22c55e' },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-[9px] mb-1">
                        <span className="text-slate-500">{label}</span>
                        <span className="font-mono" style={{ color }}>{value}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${value}%`, background: color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ── 📡 Capture tab ──────────────────────────────────────────────── */}
          {activeTab === 'capture' && captureRequest && (
            <div className="slide-in space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-orange-400 font-bold text-[10px] font-mono">POST</span>
                  <span className="text-slate-500 text-[9px] font-mono">/interactions/capture</span>
                </div>
                <JsonBlock data={captureRequest} highlights={['ActionID', 'InteractionType', 'Treatment']} />
              </div>

              {captureResponse && (
                <div className="slide-in">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400 font-bold text-[10px] font-mono">200 OK</span>
                    <span className="text-slate-500 text-[9px]">· Interaction recorded · Model update queued</span>
                  </div>
                  <JsonBlock data={captureResponse} highlights={['NextBestAction', 'PropensityDelta', 'InteractionID']} />

                  <div className="mt-3 rounded-xl p-3" style={{ background: `${persona.color}15`, border: `1px solid ${persona.color}35` }}>
                    <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1.5">Next NBA Queued by CDH</div>
                    <div className="text-white text-[11px] font-semibold mb-1">{captureResponse.NextBestAction.ActionName}</div>
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{captureResponse.NextBestAction.Treatment}</span>
                      <span className="text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded inline-flex items-center gap-1"><Radio size={8} />{captureResponse.NextBestAction.Channel}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${persona.color}25`, color: persona.color }}>
                        pAccept {(captureResponse.NextBestAction.pAccept * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-[9px] text-slate-600 mt-1.5">
                      Δ propensity: +{(captureResponse.PropensityDelta * 100).toFixed(0)}pp · {captureResponse.ATRSRef}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

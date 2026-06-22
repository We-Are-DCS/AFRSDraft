import { useState, useMemo } from 'react';
import type { StageConfig, NBAAction } from '../data/cdh';
import type { Persona } from '../data/types';

interface Props {
  stage: StageConfig;
  persona: Persona;
  nbaReady: boolean;
}

const CHANNELS = ['All', 'Web', 'Social', 'Email', 'SMS', 'App', 'Portal', 'Advisor_Desktop'];

const POLICY_GATES = [
  { key: 'eligible', label: 'Eligible', default: true },
  { key: 'consented', label: 'Consented', default: true },
  { key: 'fatigue', label: 'Fatigue PASS', default: true },
  { key: 'disparity', label: 'D&I Ratio ≥ 0.85', default: true },
  { key: 'atrs', label: 'ATRS Recorded', default: true },
];

// Generate treatment variants from base treatment
function getTreatmentVariants(base: string) {
  return [
    { id: base, label: 'Variant A (Control)', delta: 0 },
    { id: `${base}-v2`, label: 'Variant B (+headline)', delta: +0.04 },
    { id: `${base}-v3`, label: 'Variant C (Image swap)', delta: -0.02 },
  ];
}

// Simulated extra signals the marketer can inject
const SIGNAL_OPTIONS = [
  { signal: 'HighIntent_Search', value: 'army_jobs', source: 'Google Signal' },
  { signal: 'PreviousApplicationAbandoned', value: 'Step3', source: 'CDH Detect' },
  { signal: 'FitnessApp', value: 'Connected_Strava', source: 'OAuth' },
  { signal: 'ReferralSource', value: 'Friend_In_Service', source: 'UTM' },
  { signal: 'EventAttended', value: 'Virtual_Open_Day', source: 'Event Platform' },
];

function pBar(value: number, color: string, max = 1) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-1.5 flex-1">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-700">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px] font-mono w-8 text-right" style={{ color }}>{(value * 100).toFixed(0)}%</span>
    </div>
  );
}

export default function MarketerPanel({ stage, persona, nbaReady }: Props) {
  const [selectedAction, setSelectedAction] = useState(0);
  const [treatmentOverrides, setTreatmentOverrides] = useState<Record<number, number>>({});
  const [policyGates, setPolicyGates] = useState<Record<string, boolean>>(
    Object.fromEntries(POLICY_GATES.map((g) => [g.key, g.default]))
  );
  const [channelFilter, setChannelFilter] = useState('All');
  const [injectedSignals, setInjectedSignals] = useState<number[]>([]);
  const [splitPct, setSplitPct] = useState(50);
  const [disparityThreshold, setDisparityThreshold] = useState(85);
  const [showSignalPicker, setShowSignalPicker] = useState(false);

  // Compute adjusted actions based on overrides
  const adjustedActions: NBAAction[] = useMemo(() => {
    const gatePass = Object.values(policyGates).every(Boolean);
    return stage.actions
      .filter((a) => channelFilter === 'All' || a.Channel.toLowerCase().includes(channelFilter.toLowerCase()))
      .map((a, i) => {
        const variantIdx = treatmentOverrides[i] ?? 0;
        const variants = getTreatmentVariants(a.Treatment);
        const delta = variants[variantIdx]?.delta ?? 0;
        return {
          ...a,
          pAccept: gatePass ? Math.max(0, Math.min(1, a.pAccept + delta + (injectedSignals.length * 0.015))) : 0,
          Treatment: variants[variantIdx]?.id ?? a.Treatment,
        };
      })
      .sort((a, b) => b.pAccept - a.pAccept)
      .map((a, i) => ({ ...a, Rank: i + 1 }));
  }, [stage.actions, treatmentOverrides, policyGates, channelFilter, injectedSignals]);

  const winner = adjustedActions[0];
  const gateBlocked = !Object.values(policyGates).every(Boolean);

  const actionColor = (rank: number) =>
    rank === 1 ? persona.color : rank === 2 ? '#64748b' : '#334155';

  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className="rounded-xl p-3" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
        <div className="flex items-center justify-between mb-1">
          <div className="text-[10px] font-black uppercase tracking-wider text-white">Marketer · NBA Testing</div>
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${nbaReady ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-[9px] text-slate-500">{nbaReady ? 'CDH responded' : 'Awaiting CDH…'}</span>
          </div>
        </div>
        <div className="text-[9px] text-slate-600 font-mono">{stage.containerName}</div>
      </div>

      {/* Winner badge */}
      {nbaReady && !gateBlocked && winner && (
        <div className="rounded-xl p-2.5 slide-in" style={{ background: `${persona.color}18`, border: `2px solid ${persona.color}50` }}>
          <div className="flex items-center justify-between mb-0.5">
            <div className="text-[9px] font-black uppercase tracking-wider" style={{ color: persona.color }}>🏆 ARBITRATION WINNER</div>
            <div className="text-[9px] font-mono text-slate-400">Rank 1 of {adjustedActions.length}</div>
          </div>
          <div className="text-white text-[11px] font-bold leading-snug">{winner.ActionName}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-[9px] text-slate-400 font-mono">{winner.Treatment}</div>
            <div className="ml-auto flex items-center gap-2">
              {pBar(winner.pAccept, persona.color)}
              <div className="text-[10px] font-mono text-slate-400">£{winner.pValue.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {gateBlocked && (
        <div className="rounded-xl p-2.5" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
          <div className="text-red-400 text-[10px] font-bold">⛔ Policy gate blocked — no NBA will fire</div>
          <div className="text-red-400/70 text-[9px] mt-0.5">Re-enable all gates to restore arbitration</div>
        </div>
      )}

      {/* Ranked actions table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1e293b' }}>
        <div className="px-3 py-2 flex items-center justify-between" style={{ background: '#0f172a' }}>
          <div className="text-[10px] font-bold text-white">Action Ranking · {adjustedActions.length} actions</div>
          {/* Channel filter */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="text-[9px] font-mono rounded px-1.5 py-0.5 text-slate-300"
            style={{ background: '#1e293b', border: '1px solid #334155' }}
          >
            {CHANNELS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        {adjustedActions.map((action, i) => {
          const isSelected = selectedAction === i;
          const variantIdx = treatmentOverrides[i] ?? 0;
          const variants = getTreatmentVariants(stage.actions.find(a => a.ActionID === action.ActionID)?.Treatment ?? action.Treatment);
          return (
            <div
              key={action.ActionID}
              onClick={() => setSelectedAction(i)}
              className="px-3 py-2.5 cursor-pointer transition-all duration-100 border-t"
              style={{
                background: isSelected ? `${actionColor(action.Rank)}18` : '#0a1120',
                borderColor: '#1e293b',
                borderLeft: isSelected ? `3px solid ${actionColor(action.Rank)}` : '3px solid transparent',
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                  style={{ background: actionColor(action.Rank) }}
                >
                  {action.Rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-white font-semibold truncate">{action.ActionName}</div>
                  <div className="text-[9px] text-slate-500 truncate font-mono">{action.Treatment}</div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  {pBar(action.pAccept, actionColor(action.Rank))}
                </div>
              </div>
              {/* Treatment variant switcher — only shown when selected */}
              {isSelected && (
                <div className="mt-2 ml-7 slide-in">
                  <div className="text-[9px] text-slate-500 mb-1">Treatment variant</div>
                  <div className="flex gap-1 flex-wrap">
                    {variants.map((v, vi) => (
                      <button
                        key={v.id}
                        onClick={(e) => { e.stopPropagation(); setTreatmentOverrides((prev) => ({ ...prev, [i]: vi })); }}
                        className="px-2 py-0.5 rounded text-[9px] font-semibold transition-all"
                        style={{
                          background: variantIdx === vi ? actionColor(action.Rank) : '#1e293b',
                          color: variantIdx === vi ? 'white' : '#64748b',
                          border: `1px solid ${variantIdx === vi ? actionColor(action.Rank) : '#334155'}`,
                        }}
                      >
                        {v.label} {v.delta !== 0 && <span>({v.delta > 0 ? '+' : ''}{(v.delta * 100).toFixed(0)}pp)</span>}
                      </button>
                    ))}
                  </div>
                  {/* A/B split */}
                  <div className="mt-2">
                    <div className="flex justify-between text-[9px] text-slate-500 mb-0.5">
                      <span>A/B split: {splitPct}% A / {100 - splitPct}% B</span>
                      <span className="font-mono">pValue £{action.pValue.toLocaleString()}</span>
                    </div>
                    <input
                      type="range" min={0} max={100} value={splitPct}
                      onChange={(e) => setSplitPct(+e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full h-1 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: actionColor(action.Rank) }}
                    />
                  </div>
                  {/* Channel + direction */}
                  <div className="flex gap-2 mt-1.5 text-[9px]">
                    <span className="px-1.5 py-0.5 rounded font-mono" style={{ background: '#1e293b', color: '#94a3b8' }}>{action.Channel}</span>
                    <span className="px-1.5 py-0.5 rounded font-mono" style={{ background: '#1e293b', color: '#94a3b8' }}>{action.Direction}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {adjustedActions.length === 0 && (
          <div className="px-3 py-4 text-center text-[10px] text-slate-600" style={{ background: '#0a1120' }}>
            No actions match channel filter "{channelFilter}"
          </div>
        )}
      </div>

      {/* Engagement Policy Gate */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1e293b' }}>
        <div className="px-3 py-2" style={{ background: '#0f172a' }}>
          <div className="text-[10px] font-bold text-white">Engagement Policy Gate</div>
          <div className="text-[9px] text-slate-600">Toggle to simulate policy overrides</div>
        </div>
        <div className="px-3 py-2 space-y-2" style={{ background: '#0a1120' }}>
          {POLICY_GATES.map((gate) => {
            const on = policyGates[gate.key];
            return (
              <div key={gate.key} className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{gate.label}</span>
                <button
                  onClick={() => setPolicyGates((prev) => ({ ...prev, [gate.key]: !prev[gate.key] }))}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold transition-all"
                  style={{
                    background: on ? '#22c55e20' : '#ef444420',
                    color: on ? '#22c55e' : '#ef4444',
                    border: `1px solid ${on ? '#22c55e40' : '#ef444440'}`,
                  }}
                >
                  {on ? '✓ PASS' : '✗ FAIL'}
                </button>
              </div>
            );
          })}
          {/* D&I threshold slider */}
          <div className="pt-1 border-t" style={{ borderColor: '#1e293b' }}>
            <div className="flex justify-between text-[9px] text-slate-500 mb-1">
              <span>D&I Disparity threshold</span>
              <span className="font-mono" style={{ color: disparityThreshold <= 91 ? '#22c55e' : '#ef4444' }}>
                0.{disparityThreshold} {0.91 >= disparityThreshold / 100 ? '✓' : '✗'}
              </span>
            </div>
            <input
              type="range" min={70} max={99} value={disparityThreshold}
              onChange={(e) => setDisparityThreshold(+e.target.value)}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: '#22c55e' }}
            />
          </div>
        </div>
      </div>

      {/* Signal simulator */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1e293b' }}>
        <div className="px-3 py-2 flex items-center justify-between" style={{ background: '#0f172a' }}>
          <div>
            <div className="text-[10px] font-bold text-white">Signal Simulator</div>
            <div className="text-[9px] text-slate-600">Inject signals to see how NBA shifts</div>
          </div>
          <button
            onClick={() => setShowSignalPicker((v) => !v)}
            className="px-2 py-0.5 rounded text-[9px] font-bold transition-all"
            style={{ background: '#006dcc20', color: '#00c2ff', border: '1px solid #006dcc40' }}
          >
            + Add signal
          </button>
        </div>
        {/* Signal picker */}
        {showSignalPicker && (
          <div className="px-3 py-2 border-t slide-in" style={{ background: '#090f1c', borderColor: '#1e293b' }}>
            {SIGNAL_OPTIONS.map((s, i) => {
              const injected = injectedSignals.includes(i);
              return (
                <div key={s.signal} className="flex items-center justify-between py-1">
                  <div>
                    <span className="text-[9px] text-cyan-400 font-mono">{s.signal}</span>
                    <span className="text-[9px] text-slate-500 ml-1">= {s.value}</span>
                  </div>
                  <button
                    onClick={() => setInjectedSignals((prev) =>
                      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
                    )}
                    className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                    style={{
                      background: injected ? '#22c55e20' : '#1e293b',
                      color: injected ? '#22c55e' : '#64748b',
                      border: `1px solid ${injected ? '#22c55e40' : '#334155'}`,
                    }}
                  >
                    {injected ? '✓ Injected' : '+ Inject'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {/* Active injected signals */}
        {injectedSignals.length > 0 && (
          <div className="px-3 py-2 border-t" style={{ background: '#0a1120', borderColor: '#1e293b' }}>
            <div className="text-[9px] text-yellow-400 mb-1 font-bold">
              ⚡ {injectedSignals.length} signal{injectedSignals.length > 1 ? 's' : ''} injected → +{(injectedSignals.length * 1.5).toFixed(1)}pp propensity lift
            </div>
            <div className="flex gap-1 flex-wrap">
              {injectedSignals.map((i) => (
                <div key={i} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px]"
                  style={{ background: '#fbbf2420', color: '#fbbf24', border: '1px solid #fbbf2440' }}>
                  <span className="font-mono">{SIGNAL_OPTIONS[i].signal}</span>
                  <button onClick={() => setInjectedSignals((prev) => prev.filter((x) => x !== i))} className="text-yellow-600 hover:text-yellow-300">×</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Propensity impact summary */}
      <div className="rounded-xl p-3" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
        <div className="text-[10px] font-bold text-white mb-2">Propensity Impact Summary</div>
        <div className="space-y-1.5">
          {[
            { label: 'Base propensity', value: stage.propensity / 100, color: '#64748b' },
            { label: 'Adaptive model boost', value: (stage.adaptiveScore - stage.propensity) / 100, color: '#006dcc' },
            { label: 'Signal injection lift', value: injectedSignals.length * 0.015, color: '#fbbf24' },
            { label: 'Treatment variant delta', value: getTreatmentVariants(stage.actions[0]?.Treatment ?? '')[treatmentOverrides[0] ?? 0]?.delta ?? 0, color: persona.color },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="text-[9px] text-slate-500 w-36 flex-shrink-0">{label}</div>
              {pBar(Math.abs(value), color)}
              <div className="text-[9px] font-mono w-10 text-right" style={{ color }}>
                {value >= 0 ? '+' : ''}{(value * 100).toFixed(1)}pp
              </div>
            </div>
          ))}
          <div className="pt-1.5 border-t flex items-center" style={{ borderColor: '#1e293b' }}>
            <div className="text-[9px] font-bold text-white w-36 flex-shrink-0">Effective pAccept</div>
            {pBar(Math.min(1, winner?.pAccept ?? 0), persona.color)}
            <div className="text-[10px] font-black w-10 text-right" style={{ color: persona.color }}>
              {((winner?.pAccept ?? 0) * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Export footer */}
      <div className="rounded-xl p-2.5 flex items-center justify-between" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
        <div className="text-[9px] text-slate-600 font-mono">ATRS-2026 · Pattern {persona.pattern} · D&I 0.91</div>
        <button
          className="px-3 py-1 rounded-lg text-[10px] font-bold transition-all"
          style={{ background: `${persona.color}20`, color: persona.color, border: `1px solid ${persona.color}40` }}
          onClick={() => {
            const payload = {
              container: stage.containerName,
              winner: winner?.ActionID,
              treatment: winner?.Treatment,
              pAccept: winner?.pAccept,
              gatesAll: Object.values(policyGates).every(Boolean),
              injectedSignals: injectedSignals.map((i) => SIGNAL_OPTIONS[i].signal),
              splitPct,
            };
            console.log('MARKETER EXPORT:', JSON.stringify(payload, null, 2));
            alert('Test config exported to console (DevTools)');
          }}
        >
          Export test config ↗
        </button>
      </div>
    </div>
  );
}

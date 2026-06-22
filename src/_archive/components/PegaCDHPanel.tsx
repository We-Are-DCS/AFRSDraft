import { useState, useEffect } from 'react';
import type { Stage, Persona } from '../data/types';

interface Props {
  stage: Stage;
  persona: Persona;
}

function PropensityBar({ value, color }: { value: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="relative h-5 bg-slate-800 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${width}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
      />
      <div className="absolute inset-0 flex items-center justify-end pr-2">
        <span className="text-white text-xs font-bold">{value}%</span>
      </div>
    </div>
  );
}

function NBACard({ decision, color, index }: { decision: { action: string; channel: string; propensity: number; treatment: string; auditRef?: string }; color: string; index: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200 + index * 150);
    return () => clearTimeout(t);
  }, [index, decision.action]);

  return (
    <div
      className={`nba-card rounded-xl p-3 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="text-white text-xs font-semibold leading-tight">{decision.action}</div>
        <div
          className="text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: `${color}33`, color }}
        >
          {decision.propensity}%
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
          📡 {decision.channel}
        </div>
        <div className="text-xs text-slate-500 font-mono">{decision.treatment}</div>
      </div>
      {decision.auditRef && (
        <div className="text-xs text-slate-600 mt-1">ATRS: {decision.auditRef}</div>
      )}
    </div>
  );
}

export default function PegaCDHPanel({ stage, persona }: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const liveScore = persona.propensityStart + Math.round(((persona.propensityEnd - persona.propensityStart) * (stage.id / 13)));
  const jitter = tick % 3 === 0 ? 1 : 0;

  const isPatternA = persona.pattern === 'A';
  const isPatternB = persona.pattern === 'B';

  return (
    <div className="flex flex-col gap-4 h-full overflow-auto">

      {/* Pega CDH header */}
      <div className="pega-gradient rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-white font-bold text-sm">Pega CDH</div>
            <div className="text-blue-200 text-xs">Customer Decision Hub · Live</div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold">LIVE</span>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-200 text-xs">Candidate Propensity Score</span>
            <span className="text-white text-xs font-mono">{persona.caseId}</span>
          </div>
          <PropensityBar value={Math.min(99, liveScore + jitter)} color="#00c2ff" />
          <div className="flex justify-between mt-2 text-xs text-blue-200">
            <span>Day 1: {persona.propensityStart}%</span>
            <span>Target: {persona.propensityEnd}%</span>
          </div>
        </div>
      </div>

      {/* Stage capabilities */}
      <div className="bg-slate-900 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: persona.color }}
          >
            {stage.id}
          </div>
          <div>
            <div className="text-white font-bold text-sm">{stage.name}</div>
            <div className="text-slate-400 text-xs">{stage.phaseLabel}</div>
          </div>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed mb-4">{stage.description}</p>

        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pega Capabilities Active</div>
        <div className="space-y-2">
          {stage.pegaCapabilities.map((cap) => (
            <div key={cap.name} className="bg-slate-800 rounded-lg p-2.5">
              <div className="text-pega font-semibold text-xs mb-0.5" style={{ color: '#00c2ff' }}>
                {cap.name}
              </div>
              <div className="text-slate-400 text-xs">{cap.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* NBA Decisions */}
      <div className="bg-slate-900 rounded-2xl p-4">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          NBA Decisions — {stage.dayRange}
        </div>
        <div className="space-y-2">
          {stage.nbaDecisions.map((decision, i) => (
            <NBACard
              key={`${decision.action}-${stage.id}`}
              decision={decision}
              color={persona.color}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Pattern-specific layer */}
      {isPatternA && stage.aemContent && (
        <div className="rounded-2xl p-4" style={{ background: '#006dcc18', border: '1px solid #006dcc30' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#006dcc' }}>
              CDH Content
            </div>
            <div className="text-xs text-slate-400">Personalised content layer · Pattern A</div>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{stage.aemContent}</p>
          <div className="mt-3 bg-black/20 rounded-lg p-2">
            <div className="text-xs text-slate-400 mb-1">Architecture flow</div>
            <div className="text-xs font-mono text-cyan-300">CDH decides → content ID → Real-Time Container → served</div>
          </div>
        </div>
      )}

      {isPatternB && stage.aepLayer && (
        <div className="rounded-2xl p-4" style={{ background: '#006dcc18', border: '1px solid #006dcc30' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#006dcc' }}>
              CDH Activation
            </div>
            <div className="text-xs text-slate-400">Audience activation · Pattern B</div>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{stage.aepLayer}</p>
          <div className="mt-3 bg-black/20 rounded-lg p-2">
            <div className="text-xs text-slate-400 mb-1">Activation pipeline</div>
            <div className="text-xs font-mono text-cyan-300">CDH → activation connector → paid-media channels (30-120s)</div>
          </div>
        </div>
      )}

      {/* Candidate sees */}
      <div className="bg-slate-900 rounded-2xl p-4">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Candidate Sees</div>
        <p className="text-slate-300 text-xs leading-relaxed">{stage.candidateSees}</p>
      </div>

      {/* D&I / Fairness */}
      <div className="bg-slate-900 rounded-2xl p-4">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">D&amp;I &amp; Fairness Checks</div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Disparity ratio</span>
            <span className="text-xs font-bold text-green-400">0.91 PASS ≥ 0.85</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">ATRS audit log</span>
            <span className="text-xs font-bold text-green-400">Recorded ✓</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Cohort</span>
            <span className="text-xs text-slate-300">{persona.background.split(' · ')[0]}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Retention forecast</span>
            <span className="text-xs font-bold" style={{ color: persona.color }}>
              {persona.name === 'james' ? '78% Phase 1 · 64% 2yr' : persona.name === 'sarah' ? '88% BRNC · 75% 5yr' : '82% Phase 1 · 70% 2yr'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

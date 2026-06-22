import type { Stage, Persona } from '../data/types';

interface Props {
  stage: Stage;
  persona: Persona;
}

const serviceColor: Record<string, string> = {
  army: '#4a6741',
  navy: '#003087',
  raf: '#003591',
};

export default function RecruiterDesktop({ stage, persona }: Props) {
  const color = serviceColor[persona.service];

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden">
      {/* Header bar */}
      <div className="pega-gradient px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-white font-bold text-sm">Pega Constellation</div>
          <div className="text-blue-200 text-xs">AFCO Caseworker Desktop</div>
        </div>
        <div className="text-blue-200 text-xs">Case {persona.caseId} · SLA: D{stage.id * 2}/30</div>
      </div>

      {/* Nav tabs */}
      <div className="flex gap-px bg-slate-800 text-xs">
        {['Cases', 'My queue', 'Diary', 'Reports', 'Library'].map((tab, i) => (
          <div
            key={tab}
            className={`px-3 py-2 ${i === 1 ? 'bg-slate-700 text-white font-semibold' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="p-4">
        {/* Case header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-white font-bold text-sm">{persona.name} W. · {persona.location} · {persona.role}</div>
            <div className="text-slate-400 text-xs mt-0.5">
              Stage {stage.id}: {stage.name} ({stage.status === 'done' ? 'completed' : stage.status === 'active' ? 'active' : 'pending'}) · {stage.dayRange}
            </div>
          </div>
          <div
            className="text-xs font-semibold px-2.5 py-1 rounded-lg"
            style={{ background: `${color}22`, color }}
          >
            {stage.status === 'done' ? 'Done ✓' : stage.status === 'active' ? '● Active' : '○ Pending'}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex gap-1 text-xs mb-4 border-b border-slate-800 pb-1">
          {['Overview', 'Activity', 'Documents', 'Decisions', 'Communications'].map((tab, i) => (
            <div
              key={tab}
              className={`px-2 py-1 ${i === 0 ? 'text-white border-b-2 -mb-[5px]' : 'text-slate-500'}`}
              style={i === 0 ? { borderColor: color } : {}}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Active stages */}
          <div className="col-span-2">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Active Stages</div>
            <div className="space-y-2">
              <div className="bg-slate-800 rounded-lg p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-xs font-semibold">Stage {stage.id} · {stage.name}</span>
                  <span
                    className="text-xs"
                    style={{ color: stage.status === 'done' ? '#4ade80' : stage.status === 'active' ? '#fbbf24' : '#64748b' }}
                  >
                    {stage.status === 'done' ? 'Done' : stage.status === 'active' ? 'In progress' : 'Pending'}
                  </span>
                </div>
                <div className="text-slate-400 text-xs">{stage.outcome} · {stage.dayRange}</div>
              </div>
              {stage.id < 13 && (
                <div className="bg-slate-800 rounded-lg p-2.5 opacity-60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-semibold">Stage {stage.id + 1} · Next stage</span>
                    <span className="text-slate-500 text-xs">Queued</span>
                  </div>
                  <div className="text-slate-500 text-xs">SLA target: auto-calculated</div>
                </div>
              )}
            </div>
          </div>

          {/* NBA prioritised actions */}
          <div className="col-span-2">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              NBA — Actions Prioritised for {persona.name}
            </div>
            <div className="space-y-2">
              {stage.nbaDecisions.map((decision, i) => (
                <div key={i} className="nba-card rounded-lg p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-white text-xs">{i + 1}. {decision.action}</div>
                    <div
                      className="text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: `${color}33`, color }}
                    >
                      pAccept {(decision.propensity / 100).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-slate-500 text-xs mt-1">{decision.channel} · {decision.treatment}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SLA tracker */}
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">SLA Tracker</div>
            <div className="bg-slate-800 rounded-lg p-2.5 space-y-1.5">
              {[
                { label: 'AFCO + Apply', day: 7, done: stage.id > 3 },
                { label: 'Conditional offer', day: 10, done: stage.id > 5 },
                { label: 'Medical clear', day: 12, done: stage.id > 6 },
                { label: 'Vetting', day: 21, done: stage.id > 7 },
                { label: 'Phase 1 start', day: persona.targetDay, done: stage.id === 13 },
              ].map(({ label, day, done }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className={`text-xs font-semibold ${done ? 'text-green-400' : 'text-slate-500'}`}>
                    {done ? '✓' : `Day ${day}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Case trajectory */}
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Case Trajectory</div>
            <div className="bg-slate-800 rounded-lg p-2.5 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Status</span>
                <span className="text-xs font-semibold text-green-400">On track</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Risk flags</span>
                <span className="text-xs font-semibold text-green-400">None</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">All decisions</span>
                <span className="text-xs font-semibold text-green-400">ATRS-recorded</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Propensity</span>
                <span className="text-xs font-semibold" style={{ color }}>
                  {persona.propensityStart + Math.round(((persona.propensityEnd - persona.propensityStart) * (stage.id / 13)))}%
                </span>
              </div>
            </div>
          </div>

          {/* Cohort funnel */}
          <div className="col-span-2">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              {persona.service === 'army' ? 'REME' : persona.service === 'raf' ? 'RAF Aircraft Tech' : 'RN Officer'} Cohort Funnel — This Month
            </div>
            <div className="bg-slate-800 rounded-lg p-2.5">
              <div className="flex items-end gap-1 h-12 mb-2">
                {[
                  { label: 'Attracted', value: 12480, h: 100 },
                  { label: 'Engaged', value: 4230, h: 34 },
                  { label: 'Applied', value: 720, h: 6 },
                  { label: 'Reached AC', value: 248, h: 2 },
                  { label: 'Passed AC', value: 192, h: 1.5 },
                  { label: 'Offers', value: 188, h: 1.5 },
                ].map(({ label, value, h }) => (
                  <div key={label} className="flex-1 flex flex-col items-center gap-0.5">
                    <div
                      className="w-full rounded-sm"
                      style={{ height: `${h}%`, minHeight: 4, background: color, opacity: stage.id > 1 ? 1 : 0.3 }}
                    />
                    <div className="text-slate-500 text-[9px] text-center leading-tight">{label}</div>
                    <div className="text-slate-400 text-[9px] font-mono">{value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Stage, Persona } from '../data/types';

interface Props {
  stages: Stage[];
  persona: Persona;
  selectedStage: number;
  onSelectStage: (id: number) => void;
}

const phaseLabels: Record<number, string> = {
  1: 'Phase 1',
  2: 'Phase 2',
  3: 'Phase 3',
  4: 'Phase 4',
  5: 'Phase 5',
};

const phaseColors: Record<number, string> = {
  1: '#7c3aed',
  2: '#0369a1',
  3: '#b45309',
  4: '#065f46',
  5: '#9f1239',
};

export default function JourneyMap({ stages, persona, selectedStage, onSelectStage }: Props) {
  const phases = [1, 2, 3, 4, 5] as const;

  return (
    <div className="bg-slate-900 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-sm">13-Stage AFRS Journey</h3>
        <div className="text-xs text-slate-400">Case: {persona.caseId}</div>
      </div>

      {phases.map((phase) => {
        const phaseStages = stages.filter((s) => s.phase === phase);
        return (
          <div key={phase} className="mb-3">
            <div
              className="text-xs font-bold mb-2 px-2 py-1 rounded-md inline-block"
              style={{ background: `${phaseColors[phase]}22`, color: phaseColors[phase] }}
            >
              {phaseLabels[phase]} · {phaseStages[0]?.phaseLabel.replace(/Phase \d: /, '')}
            </div>
            <div className="flex flex-wrap gap-2">
              {phaseStages.map((stage) => {
                const isSelected = stage.id === selectedStage;
                const isDone = stage.status === 'done';
                const isActive = stage.status === 'active';

                return (
                  <button
                    key={stage.id}
                    onClick={() => onSelectStage(stage.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                    style={{
                      background: isSelected
                        ? persona.color
                        : isDone
                        ? `${persona.color}22`
                        : isActive
                        ? `${persona.color}15`
                        : 'rgba(30,41,59,0.6)',
                      border: isSelected
                        ? `1px solid ${persona.color}`
                        : isDone
                        ? `1px solid ${persona.color}44`
                        : isActive
                        ? `1px solid ${persona.color}33`
                        : '1px solid rgba(51,65,85,0.5)',
                      color: isSelected ? 'white' : isDone ? persona.color : isActive ? '#94a3b8' : '#64748b',
                    }}
                  >
                    <span className="font-bold text-[10px] opacity-70">{stage.id}</span>
                    <span>{stage.shortName}</span>
                    {isDone && <span className="text-[10px]">✓</span>}
                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: persona.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: persona.color }} /> Done
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ background: `${persona.color}66` }}
            />
            Active
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-700" /> Pending
          </div>
        </div>
      </div>
    </div>
  );
}

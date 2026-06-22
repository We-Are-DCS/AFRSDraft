import type { Persona } from '../data/types';

interface Props {
  persona: Persona;
  selected: boolean;
  onClick: () => void;
}

const serviceLabel: Record<string, string> = {
  army: 'British Army',
  navy: 'Royal Navy',
  raf: 'Royal Air Force',
};

const patternDesc: Record<string, string> = {
  A: 'CDH decides · personalised content served via Real-Time Container',
  B: 'CDH decides · audience activation via paid-media channels',
  C: 'CDH Real-Time Container · single-platform decisioning',
};

export default function PersonaCard({ persona, selected, onClick }: Props) {
  const borderColor = selected ? `2px solid ${persona.color}` : '2px solid transparent';

  return (
    <button
      onClick={onClick}
      className="text-left w-full rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: selected
          ? `linear-gradient(135deg, ${persona.color}22, ${persona.color}11)`
          : 'rgba(30,41,59,0.8)',
        border: borderColor,
        boxShadow: selected ? `0 0 24px ${persona.color}44` : 'none',
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ background: persona.color }}
        >
          {persona.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-white text-lg">{persona.name}</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${persona.color}33`, color: persona.color }}
            >
              Pattern {persona.pattern}
            </span>
          </div>
          <div className="text-sm font-medium mb-1" style={{ color: persona.color }}>
            {serviceLabel[persona.service]} · {persona.role}
          </div>
          <div className="text-xs text-slate-400 mb-2">{persona.background}</div>
          <div className="text-xs text-slate-500">{patternDesc[persona.pattern]}</div>
          <div className="mt-3 flex items-center gap-3">
            <div className="text-xs">
              <span className="text-slate-500">Target: </span>
              <span className="text-white font-medium">Day {persona.targetDay}</span>
            </div>
            <div className="text-xs">
              <span className="text-slate-500">Propensity: </span>
              <span className="font-medium" style={{ color: persona.color }}>
                {persona.propensityStart}% → {persona.propensityEnd}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

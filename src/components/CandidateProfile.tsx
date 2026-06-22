import { useState } from 'react';
import { Sword, Anchor, Plane, ChevronDown, ChevronUp } from 'lucide-react';
import type { StageConfig } from '../data/cdh';
import type { Persona } from '../data/types';

interface Props {
  stage: StageConfig;
  persona: Persona;
  showSignalFeed?: boolean;
}

function CollapsibleTile({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 transition-colors"
        style={{ background: '#f8fafc' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{title}</span>
          {badge && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">{badge}</span>
          )}
        </div>
        {open ? <ChevronUp size={13} className="text-slate-400" /> : <ChevronDown size={13} className="text-slate-400" />}
      </button>
      {open && <div className="bg-white px-3 py-3">{children}</div>}
    </div>
  );
}

const serviceLabel: Record<string, string> = {
  army: 'British Army',
  navy: 'Royal Navy',
  raf: 'Royal Air Force',
};

function ServiceIcon({ svc }: { svc: string }) {
  if (svc === 'army') return <Sword size={12} />;
  if (svc === 'navy') return <Anchor size={12} />;
  return <Plane size={12} />;
}

export default function CandidateProfile({ stage, persona, showSignalFeed }: Props) {

  const profileContent = (
    <div
      className="rounded-2xl p-4"
      style={{ background: `linear-gradient(135deg, ${persona.color}18, ${persona.color}08)`, border: `1px solid ${persona.color}30` }}
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-sm"
          style={{ background: persona.color }}
        >
          {persona.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-base leading-tight" style={{ color: persona.color }}>{persona.name}</div>
          <div className="text-slate-600 text-xs mt-0.5 flex items-center gap-1"><ServiceIcon svc={persona.service} /> {serviceLabel[persona.service]}</div>
        </div>
      </div>

      {/* Personal details grid */}
      <div className="space-y-1.5 mb-3">
        {[
          { label: 'Role', value: persona.role },
          { label: 'Age', value: `${persona.age} years old` },
          { label: 'Location', value: persona.location },
          { label: 'Background', value: persona.background },
          ...(persona.builderCohort ? [{ label: 'Cohort', value: persona.builderCohort }] : []),
          ...(persona.builderEducation ? [{ label: 'Education', value: persona.builderEducation }] : []),
          { label: 'Target', value: `Day ${persona.targetDay} · ${persona.targetMilestone}` },
        ].map(({ label, value }) => (
          <div key={label} className="flex gap-2 text-[11px]">
            <span className="text-slate-400 flex-shrink-0 w-20">{label}</span>
            <span className="text-slate-700 font-medium leading-snug">{value}</span>
          </div>
        ))}
      </div>

      {/* Propensity scores */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg p-2 text-center" style={{ background: `${persona.color}12` }}>
          <div className="text-slate-500 text-[9px] uppercase tracking-wide mb-0.5">Propensity</div>
          <div className="font-black text-lg leading-none" style={{ color: persona.color }}>{stage.propensity}%</div>
          <div className="text-[9px] text-slate-400 mt-0.5">{persona.propensityStart}% → {persona.propensityEnd}%</div>
        </div>
        <div className="rounded-lg p-2 text-center bg-cyan-50">
          <div className="text-slate-500 text-[9px] uppercase tracking-wide mb-0.5">Adaptive Score</div>
          <div className="font-black text-lg leading-none text-cyan-600">{stage.adaptiveScore}%</div>
          <div className="text-[9px] text-slate-400 mt-0.5">CDH model</div>
        </div>
      </div>

      {/* Case ID */}
      <div className="mt-2.5 text-[9px] font-mono text-slate-400 text-center">{persona.caseId}</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-2.5">

      {/* Profile card — collapsible when CDH API panel is open */}
      {showSignalFeed
        ? <CollapsibleTile title="Candidate Profile" badge={persona.name}>{profileContent}</CollapsibleTile>
        : profileContent
      }


    </div>
  );
}

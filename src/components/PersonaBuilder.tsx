import { useState, useEffect, useMemo } from 'react';
import { Sword, Anchor, Plane, X as XIcon } from 'lucide-react';
import type { Persona, ServiceType, PatternType } from '../data/types';
import { useTheme, useThemeColors } from '../context/ThemeContext';

interface ServiceOption {
  id: ServiceType;
  label: string;
  fullName: string;
  color: string;
  icon: React.ReactNode;
  pattern: PatternType;
  stageKey: string;
  crest: string;
}

const SERVICES: ServiceOption[] = [
  {
    id: 'army', label: 'Army', fullName: 'British Army', color: '#4a6741',
    icon: <Sword size={24} />, pattern: 'C', stageKey: 'james',
    crest: 'CDH Real-Time Container · single-platform decisioning',
  },
  {
    id: 'navy', label: 'Royal Navy', fullName: 'Royal Navy', color: '#003087',
    icon: <Anchor size={24} />, pattern: 'A', stageKey: 'sarah',
    crest: 'CDH personalised content · Real-Time Container',
  },
  {
    id: 'raf', label: 'RAF', fullName: 'Royal Air Force', color: '#003591',
    icon: <Plane size={24} />, pattern: 'B', stageKey: 'george',
    crest: 'CDH audience activation · paid-media channels',
  },
];

export const ROLES_BY_SERVICE: Record<ServiceType, string[]> = {
  army: [
    'REME Vehicle Mechanic', 'Infantry Soldier', 'Royal Signals Operator',
    'Royal Artillery Gunner', 'Combat Medical Technician', 'Army Chef',
    'Royal Logistics Specialist', 'Intelligence Analyst', 'Army Air Corps',
    'Royal Engineers', 'Army Officer (Sandhurst)',
  ],
  navy: [
    'Warfare Officer', 'Engineering Officer', 'Medical Officer',
    'Rating (Seaman Specialist)', 'Submariner', 'Royal Marines Commando',
    'Air Engineering Technician', 'Hydrographic Specialist',
    'Logistics Officer', 'Nurse (QARNNS)', 'Naval Aviator',
  ],
  raf: [
    'Aircraft Technician', 'Pilot', 'Weapons Technician',
    'Intelligence Analyst', 'RAF Police', 'Air Traffic Controller',
    'Nurse (PMRAFNS)', 'Cyberspace Operations', 'Air Operations',
    'RAF Regiment Gunner', 'Systems Engineering Officer',
  ],
};

const EDUCATION_LEVELS = [
  'No formal qualifications',
  'GCSEs (inc. Maths & English)',
  'A-Levels (2+ subjects)',
  'BTEC / HNC / HND',
  'Degree (BSc / BA / BEng)',
  'Postgraduate (MSc / MA / MBA)',
];

const AGE_RANGES = ['16–17', '18–25', '26–35', '36+'];

const INTERESTS = [
  'Engineering', 'Technology & Computing', 'Sport & Fitness',
  'Travel & Adventure', 'Leadership', 'Aviation', 'Maritime',
  'Healthcare', 'Trades & Craft', 'Cyber & Intelligence',
];

const COHORTS: Record<ServiceType, string[]> = {
  army: ['Trades-aligned', 'Diversity-led', 'Officer pathway', 'STEM graduate', 'Sixth-form leaver'],
  navy: ['Officer pathway', 'STEM graduate', 'Female STEM', 'Diversity-led', 'Rating pathway'],
  raf: ['Diversity-led STEM', 'Sixth-form leaver', 'STEM graduate', 'Apprenticeship track', 'Officer pathway'],
};

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (persona: Persona) => void;
  editPersona?: Persona | null;
  /** @deprecated Pass nothing — theme is now read from ThemeContext */
  theme?: unknown;
}

export default function PersonaBuilder({ isOpen, onClose, onApply, editPersona }: Props) {
  const { theme } = useTheme();
  const { tx, tm } = useThemeColors();
  const isEditing = !!(editPersona?.isCustom);

  const [service, setService] = useState<ServiceType>('army');
  const [role, setRole] = useState(ROLES_BY_SERVICE.army[0]);
  const [name, setName] = useState('Alex');
  const [ageRange, setAgeRange] = useState('18–25');
  const [location, setLocation] = useState('Birmingham');
  const [education, setEducation] = useState(EDUCATION_LEVELS[1]);
  const [interests, setInterests] = useState<string[]>(['Engineering', 'Sport & Fitness']);
  const [cohort, setCohort] = useState(COHORTS.army[0]);

  // Pre-fill form when editing an existing persona
  useEffect(() => {
    if (editPersona?.isCustom) {
      setService(editPersona.service);
      setRole(editPersona.role);
      setName(editPersona.name);
      setLocation(editPersona.location);
      setAgeRange(editPersona.builderAgeRange ?? '18–25');
      setEducation(editPersona.builderEducation ?? EDUCATION_LEVELS[1]);
      setInterests(editPersona.builderInterests ?? []);
      setCohort(editPersona.builderCohort ?? COHORTS[editPersona.service][0]);
    } else if (!editPersona) {
      // Reset to defaults for new persona
      setService('army');
      setRole(ROLES_BY_SERVICE.army[0]);
      setName('Alex');
      setAgeRange('18–25');
      setLocation('Birmingham');
      setEducation(EDUCATION_LEVELS[1]);
      setInterests(['Engineering', 'Sport & Fitness']);
      setCohort(COHORTS.army[0]);
    }
  }, [editPersona, isOpen]);

  const svc = SERVICES.find((s) => s.id === service)!;

  const handleServiceChange = (s: ServiceType) => {
    setService(s);
    setRole(ROLES_BY_SERVICE[s][0]);
    setCohort(COHORTS[s][0]);
  };

  const toggleInterest = (i: string) => {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  };

  const cdh_context = useMemo(() => ({
    CustomerProfile: {
      CustomerID: isEditing
        ? editPersona?.caseId
        : `CDH-CUST-${name.toUpperCase().replace(/\s/g, '')}-${Date.now().toString().slice(-6)}`,
      Service: service.toUpperCase(),
      RolePreference: role,
      AgeRange: ageRange,
      Location: location,
      EducationLevel: education,
      Interests: interests,
      Cohort: cohort,
      Pattern: svc.pattern,
    },
    DecisioningContext: {
      ContainerName: `AFRS_${service.toUpperCase()}_Attract_Container`,
      Channel: 'PAID_SOCIAL',
      Direction: 'OUTBOUND',
    },
  }), [service, role, name, ageRange, location, education, interests, cohort, svc, isEditing, editPersona]);

  const handleApply = () => {
    const ageNum = ageRange === '16–17' ? 17 : ageRange === '18–25' ? 21 : ageRange === '26–35' ? 30 : 38;
    const persona: Persona = {
      // Preserve ID when editing so updates replace the same entry
      id: isEditing ? editPersona!.id : `custom-${service}-${Date.now()}`,
      name,
      service,
      pattern: svc.pattern,
      role,
      age: ageNum,
      location,
      background: `${education} · ${cohort}`,
      tagline: svc.crest,
      propensityStart: 60,
      propensityEnd: 85,
      targetDay: 60,
      targetMilestone: 'Phase 1 training',
      caseId: isEditing ? editPersona!.caseId : `CID-2026-AFRS-${Math.floor(Math.random() * 90000 + 10000)}`,
      color: svc.color,
      gradientClass: `${service}-gradient`,
      avatar: name.trim().charAt(0).toUpperCase() || '?',
      isCustom: true,
      builderEducation: education,
      builderCohort: cohort,
      builderInterests: interests,
      builderAgeRange: ageRange,
    };
    onApply(persona);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: theme.bg, border: `1px solid ${theme.border}` }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}
        >
          <div>
            <div className="font-black text-sm" style={{ color: tx }}>
              {isEditing ? `Edit Persona — ${editPersona!.name}` : 'Build New Candidate Persona'}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: tm }}>
              {isEditing
                ? `Updating ${editPersona!.name} · ${editPersona!.role} · CDH context will re-run`
                : 'Configure profile · saved to workspace · CDH renders journey automatically'}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all hover:scale-110"
            style={{ background: theme.bgAlt, color: tm, border: `1px solid ${theme.border}` }}
          >
            <XIcon size={14} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* ── 1. Service ── */}
          <section>
            <div className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: tm }}>
              1 · Armed Service
            </div>
            <div className="grid grid-cols-3 gap-3">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleServiceChange(s.id)}
                  className="rounded-xl p-4 text-left transition-all duration-150 hover:scale-[1.02]"
                  style={{
                    background: service === s.id ? `${s.color}20` : theme.bgAlt,
                    border: `2px solid ${service === s.id ? s.color : theme.border}`,
                    boxShadow: service === s.id ? `0 0 20px ${s.color}40` : 'none',
                  }}
                >
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="font-black text-sm mb-0.5" style={{ color: service === s.id ? s.color : tx }}>
                    {s.fullName}
                  </div>
                  <div className="text-[9px] leading-snug" style={{ color: tm }}>{s.crest}</div>
                </button>
              ))}
            </div>
          </section>

          {/* ── 2. Role + Cohort ── */}
          <section className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: tm }}>
                2 · Role Interest
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold outline-none"
                style={{ background: theme.bgAlt, border: `1px solid ${theme.border}`, color: tx }}
              >
                {ROLES_BY_SERVICE[service].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: tm }}>
                Cohort Segment
              </div>
              <select
                value={cohort}
                onChange={(e) => setCohort(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold outline-none"
                style={{ background: theme.bgAlt, border: `1px solid ${theme.border}`, color: tx }}
              >
                {COHORTS[service].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </section>

          {/* ── 3. Personal details ── */}
          <section>
            <div className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: tm }}>
              3 · Candidate Details
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold block mb-1" style={{ color: tm }}>First name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex"
                  className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold outline-none"
                  style={{ background: theme.bgAlt, border: `1px solid ${theme.border}`, color: tx }}
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold block mb-1" style={{ color: tm }}>Location / city</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Birmingham"
                  className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold outline-none"
                  style={{ background: theme.bgAlt, border: `1px solid ${theme.border}`, color: tx }}
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold block mb-1" style={{ color: tm }}>Age range</label>
                <div className="flex gap-1.5 flex-wrap">
                  {AGE_RANGES.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAgeRange(a)}
                      className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                      style={{
                        background: ageRange === a ? svc.color : theme.bgAlt,
                        color: ageRange === a ? 'white' : tm,
                        border: `1px solid ${ageRange === a ? svc.color : theme.border}`,
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold block mb-1" style={{ color: tm }}>Education level</label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold outline-none"
                  style={{ background: theme.bgAlt, border: `1px solid ${theme.border}`, color: tx }}
                >
                  {EDUCATION_LEVELS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* ── 4. Interests ── */}
          <section>
            <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: tm }}>
              4 · Interests &amp; Signals <span className="font-normal opacity-60">(sent as CDH context)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {INTERESTS.map((i) => {
                const active = interests.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleInterest(i)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all duration-150"
                    style={{
                      background: active ? `${svc.color}25` : theme.bgAlt,
                      color: active ? svc.color : tm,
                      border: `1px solid ${active ? svc.color : theme.border}`,
                    }}
                  >
                    {active ? '✓ ' : ''}{i}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── 5. CDH context preview ── */}
          <section>
            <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: tm }}>
              5 · CDH Container Input Preview
            </div>
            <div
              className="rounded-xl p-3 font-mono text-[9px] overflow-x-auto"
              style={{ background: '#020812', border: `1px solid ${theme.border}` }}
            >
              <div className="text-slate-500 mb-1">// POST /prweb/api/v1/real-time-container</div>
              <pre className="whitespace-pre-wrap leading-relaxed" style={{ color: '#94d4ff' }}>
                {JSON.stringify(cdh_context, null, 2)}
              </pre>
            </div>
          </section>
        </div>

        {/* ── Footer ── */}
        <div
          className="sticky bottom-0 flex items-center justify-between px-6 py-4 gap-4"
          style={{ background: theme.headerBg, borderTop: `1px solid ${theme.border}` }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0"
              style={{ background: svc.color }}
            >
              {name.trim().charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <div className="text-xs font-bold" style={{ color: tx }}>
                {name || 'Candidate'} · {svc.fullName} · {role}
              </div>
              <div className="text-[10px]" style={{ color: tm }}>
                {ageRange} · {location}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{ background: theme.bgAlt, color: tm, border: `1px solid ${theme.border}` }}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!name.trim()}
              className="px-5 py-2 rounded-xl text-xs font-black text-white transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: svc.color, boxShadow: `0 0 20px ${svc.color}60` }}
            >
              {isEditing ? '✓ Update & Apply → CDH' : '+ Save & Apply → CDH'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

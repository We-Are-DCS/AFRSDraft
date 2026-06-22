import type { Stage, Persona } from '../data/types';

interface Props {
  stage: Stage;
  persona: Persona;
}

const serviceShortName: Record<string, string> = {
  army: 'Army',
  navy: 'Royal Navy',
  raf: 'RAF',
};

const serviceUrl: Record<string, string> = {
  army: 'recruit.army.mod.uk',
  navy: 'recruit.royalnavy.mod.uk',
  raf: 'recruit.raf.mod.uk',
};

function StatusBar({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 text-white text-xs" style={{ background: color }}>
      <span className="font-semibold">10:24</span>
      <div className="flex items-center gap-1">
        <span>●</span>
        <span>5G</span>
        <span>|</span>
        <span>84%</span>
      </div>
    </div>
  );
}

function NavBar({ label, persona }: { label: string; persona: Persona }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-white text-xs border-b border-white/10" style={{ background: persona.color }}>
      <span className="text-white/70">←</span>
      <span className="font-semibold">{serviceShortName[persona.service]} · {label}</span>
      <span className="text-white/70">☰</span>
    </div>
  );
}

function StageScreen({ stage, persona }: { stage: Stage; persona: Persona }) {
  const stageId = stage.id;

  if (stageId === 1) {
    return (
      <div className="flex-1 overflow-auto bg-black">
        <div className="bg-slate-900 mx-3 my-3 rounded-xl overflow-hidden">
          <div
            className="h-40 flex items-end p-3"
            style={{ background: `linear-gradient(180deg, ${persona.color}66, ${persona.color})` }}
          >
            <div>
              <div className="text-white/60 text-xs mb-1">Sponsored</div>
              <div className="text-white font-bold text-sm">{persona.name === 'James' ? 'Cpl Tom Whitfield, REME' : persona.name === 'George' ? 'SAC Marcus Williams, RAF' : 'Lt Cdr Emma Carter, RN'}</div>
              <div className="text-white/80 text-xs">{persona.name === 'James' ? '"Started as an apprentice."' : persona.name === 'George' ? '"Engineer the future of flight."' : '"Lead at sea from day one."'}</div>
            </div>
          </div>
          <div className="p-3">
            <div
              className="text-xs font-bold py-2 px-3 rounded-lg text-center text-white"
              style={{ background: persona.color }}
            >
              Learn about {persona.role.split(' ').slice(0, 2).join(' ')} →
            </div>
          </div>
        </div>
        <div className="px-3 pb-3">
          <div className="text-slate-400 text-xs text-center">{persona.name === 'George' ? 'Facebook · For You' : persona.name === 'James' ? 'TikTok · For You' : 'LinkedIn · Feed'}</div>
        </div>
      </div>
    );
  }

  if (stageId === 2) {
    return (
      <div className="flex-1 overflow-auto bg-slate-950 p-3 space-y-3">
        <div
          className="rounded-xl p-4 text-white"
          style={{ background: `linear-gradient(135deg, ${persona.color}, ${persona.color}88)` }}
        >
          <div className="text-xs text-white/70 mb-1">PERSONALISED FOR YOU</div>
          <div className="font-bold text-base leading-tight">
            {persona.name === 'James' ? 'REME — engineer the Army.' : persona.name === 'George' ? 'Engineer the future of flight.' : 'Lead at sea. Engineering meets command.'}
          </div>
          <div className="text-xs text-white/80 mt-1">
            {persona.name === 'James' ? 'Earn while you learn. Civilian-recognised qualifications.' : persona.name === 'George' ? 'Apprentice Aircraft Technicians earn from year 1.' : 'Officer Insight Event — Female Leaders panel'}
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-slate-400 text-xs mb-2">RECOMMENDED ROLES · 3 of 47</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold text-sm">{persona.role}</div>
              <div className="text-slate-400 text-xs">3-yr apprenticeship · £25k+</div>
            </div>
            <div
              className="text-xs font-bold px-2 py-1 rounded-lg text-white"
              style={{ background: persona.color }}
            >
              {persona.propensityStart + 9}% MATCH
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-slate-400 text-xs mb-1">SALARY CALCULATOR</div>
          <div className="text-white text-sm">Year 1: £19k · Year 3: £25k+</div>
          <div className="text-slate-400 text-xs">Free meals, healthcare, accommodation</div>
        </div>
      </div>
    );
  }

  if (stageId === 3) {
    return (
      <div className="flex-1 overflow-auto bg-slate-950 p-3 space-y-3">
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-slate-400 text-xs mb-1">Step 1 of {persona.name === 'sarah' ? '9' : '7'} · Book AFCO</div>
          <div className="text-white font-semibold text-sm mb-2">
            {persona.name === 'James' ? 'AFCO Carlisle' : persona.name === 'George' ? 'AFCO Cardiff' : 'AFCO Manchester'}
          </div>
          <div className="bg-slate-700 rounded-lg h-16 flex items-center justify-center text-slate-500 text-xs mb-2">[Map]</div>
          <div className="text-xs text-green-400 font-semibold">Tue 13 May · 09:30 · 60 mins · Booked ✓</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-slate-400 text-xs mb-2">WHAT TO BRING</div>
          {['Photo ID (passport / driving licence)', 'Proof of address (under 3 months)', 'National Insurance number', 'GCSE certificates'].map((item) => (
            <div key={item} className="text-xs text-white py-0.5">· {item}</div>
          ))}
        </div>
        <div className="rounded-xl p-3" style={{ background: `${persona.color}22`, border: `1px solid ${persona.color}44` }}>
          <div className="text-xs font-semibold mb-1" style={{ color: persona.color }}>YOUR NEXT BEST STEP</div>
          <div className="text-white text-xs">Start fitness prep — 11 mins</div>
        </div>
      </div>
    );
  }

  if (stageId === 4) {
    return (
      <div className="flex-1 overflow-auto bg-slate-950 p-3 space-y-3">
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-slate-400 text-xs mb-1">Step 4 of 7 · Medical history</div>
          <div className="text-white font-semibold text-sm mb-1">Medical history</div>
          <div
            className="text-xs py-2 px-2.5 rounded-lg mb-3"
            style={{ background: `${persona.color}15`, color: persona.color }}
          >
            PERSONALISED FOR YOU — 9 in 10 candidates find this order helpful.
          </div>
          {[
            { q: '1. Glasses or contacts?', a: 'No ✓' },
            { q: '2. Prescribed medication?', a: 'No ✓' },
          ].map(({ q, a }) => (
            <div key={q} className="flex justify-between items-center py-2 border-b border-slate-700">
              <div className="text-white text-xs">{q}</div>
              <div className="text-green-400 text-xs font-semibold">{a}</div>
            </div>
          ))}
          <div className="mt-3 text-slate-500 text-xs">Saves as you go · 23 of 28 questions</div>
        </div>
        <button
          className="w-full py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: persona.color }}
        >
          Save and continue
        </button>
      </div>
    );
  }

  if (stageId === 5) {
    return (
      <div className="flex-1 overflow-auto bg-slate-950 p-3 space-y-3">
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-slate-400 text-xs mb-1">Step 5 of 7 · Pre-recorded interview</div>
          <div className="text-white font-semibold text-sm mb-2">Question 3 of 5</div>
          <div className="bg-slate-700 rounded-xl h-32 flex items-center justify-center mb-3 relative overflow-hidden">
            <div className="text-slate-500 text-xs">[Camera Preview · {persona.name}]</div>
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div
            className="text-sm text-white font-medium text-center mb-3 px-2"
          >
            "{persona.name === 'James' ? 'Tell us about a time when you fixed a problem under time pressure.' : persona.name === 'George' ? 'Tell us about a time when you had to learn something quickly.' : 'Describe a time you led a team through ambiguity.'}"
          </div>
          <div className="text-slate-400 text-xs text-center">{persona.name === 'sarah' ? '3 minutes · up to 2 takes' : '2 minutes · up to 2 takes'}</div>
        </div>
        <button
          className="w-full py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: persona.color }}
        >
          Start recording
        </button>
      </div>
    );
  }

  if (stageId === 6) {
    return (
      <div className="flex-1 overflow-auto bg-slate-950 p-3 space-y-3">
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-slate-400 text-xs mb-1">Medical Assessment</div>
          <div className="text-white font-semibold text-sm mb-1">Optima Health</div>
          <div className="text-slate-400 text-xs mb-3">Tri-Service medical assessment</div>
          <div className="bg-slate-700 rounded-lg p-2.5 mb-3">
            <div className="text-white text-sm font-semibold">YOUR APPOINTMENT</div>
            <div className="text-xs text-slate-300">Mon 19 May · 10:00</div>
            <div className="text-xs" style={{ color: persona.color }}>
              Optima {persona.name === 'James' ? 'Newcastle · ~50 min drive' : persona.name === 'George' ? 'Central London' : 'Manchester'}
            </div>
          </div>
          <div className="space-y-1.5">
            {['Bring photo ID ✓', 'Light breakfast only ✓', 'No alcohol 24h before ◯', 'Eyesight test prep video — View'].map((item) => (
              <div key={item} className="text-xs text-white">· {item}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stageId === 7) {
    return (
      <div className="flex-1 overflow-auto bg-slate-950 p-3 space-y-3">
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-slate-400 text-xs mb-1">Vetting</div>
          <div className="text-white font-semibold text-sm mb-1">Vetting status</div>
          <div className="text-slate-400 text-xs mb-3">{persona.name === 'sarah' ? 'SC clearance · officer pathway' : 'BPSS clearance · standard for entry roles'}</div>
          <div className="space-y-2">
            {[
              { label: 'Documents uploaded', status: 'Done', done: true },
              { label: 'Identity verified', status: 'Done', done: true },
              { label: 'Reference check 1', status: 'In progress', done: false },
              { label: 'Reference check 2', status: 'Pending', done: false },
              { label: `${persona.name === 'sarah' ? 'SC' : 'BPSS'} issued`, status: 'Pending', done: false },
            ].map(({ label, status, done }) => (
              <div key={label} className="flex justify-between items-center">
                <div className="text-xs text-white">{done ? '✓' : '○'} {label}</div>
                <div className={`text-xs font-semibold ${done ? 'text-green-400' : status === 'In progress' ? 'text-yellow-400' : 'text-slate-500'}`}>{status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stageId === 8) {
    return (
      <div className="flex-1 overflow-auto bg-slate-950 p-3 space-y-3">
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-slate-400 text-xs mb-1">Fitness prep · Day 5 of 14</div>
          <div className="text-white font-semibold text-sm mb-1">{persona.service === 'army' ? 'Army REME standard' : persona.service === 'raf' ? 'RAF Engineering standard' : 'RN Officer BPFA'}</div>
          <div className="bg-slate-700 rounded-lg p-2.5 mb-3">
            <div className="text-white text-sm font-semibold">TODAY · Tuesday</div>
            <div className="text-xs text-slate-300">{persona.service === 'army' ? '3km steady run + core circuit · 35 min' : persona.service === 'raf' ? 'Interval runs + press-ups circuit · 30 min' : '2.4km run + press-ups + sit-ups · 40 min'}</div>
          </div>
          <div className="flex gap-1 mb-3">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div
                key={i}
                className="flex-1 h-6 rounded text-xs flex items-center justify-center text-white font-bold"
                style={{ background: i < 4 ? persona.color : 'rgba(51,65,85,0.6)' }}
              >
                {day}
              </div>
            ))}
          </div>
          <div>
            <div className="text-slate-400 text-xs">PERSONAL BEST</div>
            <div className="text-white text-sm font-semibold">{persona.service === 'army' ? '2km in 9m 04s — REME standard -16s' : persona.service === 'raf' ? '2.4km in 11m 20s — on standard' : '2.4km in 10m 45s — above standard'}</div>
            <div className="text-xs mt-1" style={{ color: persona.color }}>Keep going — on track for AC!</div>
          </div>
        </div>
      </div>
    );
  }

  if (stageId === 9) {
    return (
      <div className="flex-1 overflow-auto bg-slate-950 p-3 space-y-3">
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-slate-400 text-xs mb-1">AC briefing</div>
          <div className="text-white font-semibold text-sm mb-1">
            {persona.service === 'army' ? 'Pirbright · Mon 26 May' : persona.service === 'raf' ? 'OASC Cranwell · Mon 30 May' : 'AIB Dartmouth · Mon 25 May'}
          </div>
          <div className="space-y-2 mt-3">
            {[
              { label: `Watch AC overview video (${persona.name === 'sarah' ? '18' : '8'} min)`, status: 'Done ✓' },
              { label: 'Practice teamwork exercise', status: 'Done ✓' },
              { label: `Take ${persona.service === 'army' ? 'REME' : persona.service === 'raf' ? 'Aircraft Tech' : 'Warfare Officer'} aptitude practice`, status: 'Active' },
              { label: 'Pack kit list', status: 'Pending' },
            ].map(({ label, status }) => (
              <div key={label} className="flex justify-between items-center">
                <div className="text-xs text-white">{label}</div>
                <div className={`text-xs font-semibold ${status === 'Done ✓' ? 'text-green-400' : status === 'Active' ? 'text-yellow-400' : 'text-slate-500'}`}>{status}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-3" style={{ background: `${persona.color}22`, border: `1px solid ${persona.color}44` }}>
          <div className="text-xs font-semibold mb-1" style={{ color: persona.color }}>CDH NBA — DO THIS NEXT</div>
          <div className="text-white text-xs">Take {persona.service === 'army' ? 'REME' : persona.service === 'raf' ? 'Aircraft Tech' : 'Warfare Officer'} practice quiz now</div>
        </div>
      </div>
    );
  }

  if (stageId === 10 || stageId === 11) {
    return (
      <div className="flex-1 overflow-auto bg-slate-950 p-3 space-y-3">
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-slate-400 text-xs mb-1">AC outcome</div>
          <div className="text-white font-semibold text-sm mb-1">
            {persona.service === 'army' ? 'Pirbright · 26 May' : persona.service === 'raf' ? 'OASC Cranwell' : 'AIB Dartmouth'}
          </div>
          <div
            className="text-2xl font-black text-center py-4 rounded-xl mb-3"
            style={{ background: `${persona.color}22`, color: persona.color }}
          >
            PASS
          </div>
          <div className="text-slate-300 text-xs mb-2">Recommended for {persona.role.split(' ').slice(0, 2).join(' ')} role</div>
          <div className="space-y-1">
            {['Strong on practical tasks', 'Effective in team activities', `${persona.service === 'army' ? 'REME' : persona.service === 'raf' ? 'Aircraft Tech' : 'Warfare Officer'} aptitude in top quartile`, 'Fitness above standard'].map((fb) => (
              <div key={fb} className="text-xs text-green-400">· {fb}</div>
            ))}
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-slate-400 text-xs mb-1">NEXT</div>
          <div className="text-white text-sm">Conditional offer issued by Wed 28 May</div>
          <div className="text-xs text-green-400 mt-1">SLA: 10-day commitment ✓</div>
        </div>
      </div>
    );
  }

  if (stageId === 12) {
    return (
      <div className="flex-1 overflow-auto bg-slate-950 p-3 space-y-3">
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-slate-400 text-xs mb-1">Your offer</div>
          <div className="text-white font-semibold text-sm mb-1">{persona.name === 'sarah' ? 'Commissioned' : 'Conditional'} offer — {persona.role}</div>
          <div className="text-xs text-slate-400 mb-3">issued Wed 28 May</div>
          <div className="space-y-1.5">
            <div className="text-xs text-white">· Year 1 salary: £{persona.name === 'sarah' ? '32' : '19'}k+</div>
            <div className="text-xs text-white">· Free meals &amp; healthcare</div>
            <div className="text-xs text-white">· Subsidised accommodation</div>
            <div className="text-xs text-white">· Apprentice bonus £2,500</div>
          </div>
        </div>
        <button
          className="w-full py-2.5 rounded-xl text-white text-sm font-bold"
          style={{ background: persona.color }}
        >
          Accept offer — e-sign in 30 seconds
        </button>
        <div className="text-center text-slate-500 text-xs">Questions? Chat with your AFCO advisor · Call free</div>
      </div>
    );
  }

  if (stageId === 13) {
    return (
      <div className="flex-1 overflow-auto bg-slate-950 p-3 space-y-3">
        <div
          className="rounded-xl p-4 text-white"
          style={{ background: `linear-gradient(135deg, ${persona.color}, ${persona.color}88)` }}
        >
          <div className="text-sm font-bold mb-1">Welcome to the {persona.service === 'army' ? 'Army' : persona.service === 'navy' ? 'Royal Navy' : 'RAF'}</div>
          <div className="text-xs opacity-80">Phase 1 starts {persona.name === 'sarah' ? 'BRNC Dartmouth · Day 120' : persona.name === 'george' ? 'RAF Halton · Day 60' : 'ATR Pirbright · Day 30'}</div>
          <div className="text-3xl font-black mt-2">{persona.name === 'sarah' ? '8' : persona.name === 'george' ? '4' : '8'}</div>
          <div className="text-xs opacity-80">days until you join</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="space-y-2">
            {['Pre-Phase 1 brief (online)', 'Kit list confirmed', 'Final fitness check', `Travel to ${persona.service === 'army' ? 'Pirbright' : persona.service === 'raf' ? 'Halton' : 'Dartmouth'}`].map((item, i) => (
              <div key={item} className="flex justify-between items-center">
                <div className="text-xs text-white">{item}</div>
                <div className="text-xs text-slate-400">{['21 May', '23 May', '25 May', '28 May'][i]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-slate-400 text-xs mb-1">JPA ACCOUNT</div>
          <div className="text-xs text-white">Activate before Phase 1 →</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-slate-500 text-sm text-center">{stage.candidateSees}</div>
    </div>
  );
}

export default function MobileScreen({ stage, persona }: Props) {
  const navLabel = stage.id <= 2 ? serviceUrl[persona.service] : `My application`;

  return (
    <div className="flex flex-col">
      <div className="text-xs text-slate-500 mb-3 font-medium text-center uppercase tracking-wider">
        Candidate View · {serviceShortName[persona.service]} portal
      </div>
      <div
        className="relative mx-auto rounded-[2.5rem] overflow-hidden phone-shadow"
        style={{
          width: 260,
          height: 520,
          background: '#0f172a',
          border: '6px solid #1e293b',
        }}
      >
        <div className="flex flex-col h-full">
          <StatusBar color={persona.color} />
          <NavBar label={navLabel} persona={persona} />
          <StageScreen stage={stage} persona={persona} />
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ background: persona.color }}
          >
            <div className="text-white/80 text-xs">{stage.dayRange}</div>
            <div className="bg-white/20 px-2 py-0.5 rounded-full text-white text-xs font-semibold">
              {stage.outcome}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

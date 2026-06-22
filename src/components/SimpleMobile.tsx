import { Menu } from 'lucide-react';
import type { StageConfig } from '../data/cdh';
import type { Persona } from '../data/types';
import type { Platform } from '../data/platforms';
import SocialFeed from './SocialFeed';
import StageScreen from './StageScreen';

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

const serviceShort: Record<string, string> = { army: 'Army', navy: 'Royal Navy', raf: 'RAF' };

function Stage2Screen({ persona, nbaReady, onCtaClick, capturing, captured }: {
  persona: Persona; nbaReady: boolean; onCtaClick: () => void; capturing: boolean; captured: boolean;
}) {
  return (
    <div className="flex-1 overflow-auto bg-slate-950">
      {!nbaReady && (
        <div className="p-3 space-y-3 animate-pulse">
          <div className="h-28 bg-slate-800 rounded-xl" />
          <div className="h-3 bg-slate-800 rounded w-3/4" />
          <div className="text-slate-600 text-[10px] text-center mt-4">Awaiting CDH response…</div>
        </div>
      )}
      {nbaReady && (
        <div className="p-3 space-y-2.5 slide-in">
          {/* Hero — CDH served */}
          <div
            className="rounded-xl p-3"
            style={{ background: `linear-gradient(135deg, ${persona.color}, ${persona.color}88)` }}
          >
            <div className="text-white/60 text-[9px] mb-1">CDH PERSONALISED · Real-Time Container</div>
            <div className="font-bold text-sm text-white leading-snug">
              {persona.id === 'james' ? 'REME — engineer the Army.' :
               persona.id === 'sarah' ? 'Lead at sea. Engineering meets command.' :
               'Engineer the future of flight.'}
            </div>
            <div className="text-white/70 text-[10px] mt-1">
              {persona.id === 'james' ? 'Earn while you learn. Civilian-recognised qualifications.' :
               persona.id === 'sarah' ? 'Officer Insight Event — Female Leaders panel.' :
               'Apprentice Aircraft Technicians earn from year 1.'}
            </div>
          </div>
          {/* Role match card */}
          <div className="bg-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-[9px] mb-2">RECOMMENDED ROLES · 3 of 47</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-semibold text-xs">{persona.role}</div>
                <div className="text-slate-400 text-[9px]">3-yr · £{persona.id === 'sarah' ? '32' : '19'}k+</div>
              </div>
              <div className="text-xs font-black px-2 py-1 rounded-lg text-white" style={{ background: persona.color }}>
                {persona.id === 'james' ? '94' : persona.id === 'sarah' ? '83' : '87'}% MATCH
              </div>
            </div>
          </div>
          {/* Engagement widget */}
          {persona.id === 'james' && (
            <div className="bg-slate-800 rounded-xl p-3">
              <div className="text-slate-400 text-[9px] mb-1">REME SKILLS QUIZ — Pega Widget</div>
              <div className="text-white text-[10px] mb-1">Q8: What tool checks flywheel runout?</div>
              <div className="text-green-400 text-[9px]">B. Dial test indicator (DTI) ✓ · top 12%</div>
            </div>
          )}
          {persona.id === 'sarah' && (
            <div className="bg-slate-800 rounded-xl p-3">
              <div className="text-slate-400 text-[9px] mb-1">OFFICER INSIGHT EVENT — CDH personalised</div>
              <div className="text-white text-[10px]">Female Leaders panel · Tue 21 May · Virtual</div>
              <div className="text-slate-400 text-[9px] mt-0.5">287 confirmed</div>
            </div>
          )}
          {persona.id === 'george' && (
            <div className="bg-slate-800 rounded-xl p-3">
              <div className="text-slate-400 text-[9px] mb-1">VIDEO 90% watched → CDH signal captured</div>
              <div className="text-white text-[10px]">Aircraft Technician career video</div>
              <div className="text-yellow-400 text-[9px] mt-0.5">CDH propensity updated → next NBA queued</div>
            </div>
          )}
          {/* Actionable CTA */}
          <button
            onClick={onCtaClick}
            disabled={capturing || captured}
            className="w-full py-2.5 rounded-xl text-white text-xs font-bold transition-all duration-200"
            style={{
              background: captured ? '#22c55e' : capturing ? '#475569' : persona.color,
              transform: capturing ? 'scale(0.98)' : 'scale(1)',
            }}
          >
            {captured ? '✓ Interaction captured — next NBA queued'
             : capturing ? 'Firing capture API…'
             : persona.id === 'james' ? 'Book AFCO Carlisle →'
             : persona.id === 'sarah' ? 'Reserve my place →'
             : 'Start your application →'}
          </button>
        </div>
      )}
    </div>
  );
}

function Stage3Screen({ persona, nbaReady, onCtaClick, capturing, captured }: {
  persona: Persona; nbaReady: boolean; onCtaClick: () => void; capturing: boolean; captured: boolean;
}) {
  return (
    <div className="flex-1 overflow-auto bg-slate-950 p-3 space-y-2.5">
      {!nbaReady && (
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-slate-800 rounded-xl" />
          <div className="h-12 bg-slate-800 rounded-xl" />
          <div className="text-slate-600 text-[10px] text-center">Loading candidate context…</div>
        </div>
      )}
      {nbaReady && (
        <div className="slide-in space-y-2.5">
          {persona.id === 'george' && (
            <div className="rounded-xl p-2.5" style={{ background: '#f5930015', border: '1px solid #f5930030' }}>
              <div className="text-[9px] font-semibold text-orange-400 mb-1">CDH RE-ENGAGE · Instagram deep-link</div>
              <div className="text-white text-[10px]">"The medical bit was simpler than I thought."</div>
              <div className="text-slate-400 text-[9px] mt-0.5">Clicked → returned to Step 3 pre-filled</div>
            </div>
          )}
          <div className="bg-slate-800 rounded-xl p-2.5">
            <div className="text-slate-400 text-[9px] mb-1">
              Step 1 of {persona.id === 'sarah' ? '9' : '7'} · Context pre-loaded by CDH
            </div>
            <div className="text-white font-semibold text-xs">
              {persona.id === 'james' ? 'AFCO Carlisle — Tue 13 May · 09:30 ✓'
               : persona.id === 'sarah' ? 'Officer application — LinkedIn + Insight Event context loaded'
               : 'Application returned via CDH deep-link · pre-filled'}
            </div>
            <div className="space-y-0.5 mt-1.5">
              {['Prior engagement context', 'Skills / quiz / video signals', 'Service preference confirmed'].map((item) => (
                <div key={item} className="text-[9px] text-green-400">✓ {item}</div>
              ))}
            </div>
          </div>
          {/* CDH NBA card */}
          <div className="rounded-xl p-2.5" style={{ background: `${persona.color}18`, border: `1px solid ${persona.color}40` }}>
            <div className="text-[9px] font-semibold mb-1" style={{ color: persona.color }}>
              CDH NBA · NEXT BEST STEP
            </div>
            <div className="text-white text-[10px]">
              {persona.id === 'james' ? 'Start fitness prep — 11 mins'
               : persona.id === 'sarah' ? 'Watch AIB activity walkthrough (+9pp)'
               : 'Complete medical questionnaire — simplified Q-order applied'}
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-2.5">
            <div className="flex justify-between items-center">
              <div className="text-slate-400 text-[9px]">Merit rank</div>
              <div className="text-white text-[10px] font-semibold">
                {persona.id === 'james' ? '7 of 32' : persona.id === 'sarah' ? '3 of 18' : '12 of 44'}
              </div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-slate-400 text-[9px]">AFRP SLA</div>
              <div className="text-green-400 text-[9px] font-semibold">10-day · on track ✓</div>
            </div>
          </div>
          {/* Actionable submit */}
          <button
            onClick={onCtaClick}
            disabled={capturing || captured}
            className="w-full py-2.5 rounded-xl text-white text-xs font-bold transition-all duration-200"
            style={{
              background: captured ? '#22c55e' : capturing ? '#475569' : persona.color,
              transform: capturing ? 'scale(0.98)' : 'scale(1)',
            }}
          >
            {captured ? '✓ Application submitted — next NBA queued'
             : capturing ? 'Firing capture API…'
             : 'Submit application — Step 1 of ' + (persona.id === 'sarah' ? '9' : '7')}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SimpleMobile({
  stage, persona, nbaReady, platform, capturing, captured, onCtaClick, isLive,
}: Props) {
  const topAction = stage.actions[0];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
        {serviceShort[persona.service]} · {stage.id === 1 ? platform.label : 'Candidate Portal'} · {stage.dayRange}
      </div>

      {/* Phone chrome */}
      <div
        className="relative rounded-[2.5rem] overflow-hidden phone-shadow flex flex-col"
        style={{ width: 240, height: 500, background: '#0f172a', border: '6px solid #1e293b' }}
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between px-4 py-2 text-white text-[10px] flex-shrink-0"
          style={{ background: stage.id === 1 ? platform.color : persona.color }}
        >
          <span className="font-semibold">10:24</span>
          <div className="flex gap-1">
            <span>●</span><span>5G</span><span>84%</span>
          </div>
        </div>

        {/* Platform/nav bar */}
        <div
          className="flex items-center justify-between px-3 py-2 text-[10px] border-b border-white/10 flex-shrink-0"
          style={{ background: stage.id === 1 ? platform.color : persona.color }}
        >
          <span className="text-white/60">←</span>
          <span className="text-white font-semibold">
            {stage.id === 1
              ? `${platform.icon} ${platform.label} · ${platform.feedLabel}`
              : `${serviceShort[persona.service]} · ${stage.id === 2 ? 'Careers' : 'My application'}`}
          </span>
          <Menu size={14} className="text-white/60" />
        </div>

        {/* Screen content */}
        {stage.id === 1 && (
          <SocialFeed
            platform={platform}
            persona={persona}
            nbaReady={nbaReady}
            topAction={topAction}
            adaptiveScore={stage.adaptiveScore}
            onCtaClick={onCtaClick}
            capturing={capturing}
            captured={captured}
            isLive={isLive}
          />
        )}
        {stage.id === 2 && (
          <Stage2Screen
            persona={persona}
            nbaReady={nbaReady}
            onCtaClick={onCtaClick}
            capturing={capturing}
            captured={captured}
          />
        )}
        {stage.id === 3 && (
          <Stage3Screen
            persona={persona}
            nbaReady={nbaReady}
            onCtaClick={onCtaClick}
            capturing={capturing}
            captured={captured}
          />
        )}
        {stage.id >= 4 && (
          <StageScreen
            stage={stage}
            persona={persona}
            nbaReady={nbaReady}
            capturing={capturing}
            captured={captured}
            onCtaClick={onCtaClick}
            isLive={isLive}
          />
        )}

        {/* Footer status */}
        <div
          className="px-3 py-2 flex items-center justify-between flex-shrink-0"
          style={{ background: stage.id === 1 ? platform.color : persona.color }}
        >
          <div className="text-white/60 text-[9px]">{stage.dayRange}</div>
          {nbaReady && !captured && (
            <div className="bg-white/20 px-2 py-0.5 rounded-full text-white text-[9px] font-semibold slide-in">
              NBA rendered ✓
            </div>
          )}
          {captured && (
            <div className="bg-green-500/30 px-2 py-0.5 rounded-full text-green-300 text-[9px] font-semibold slide-in">
              Captured ✓
            </div>
          )}
        </div>
      </div>

      {/* Status label below phone */}
      <div className="text-[10px] text-slate-600 text-center max-w-[220px] leading-tight">
        {captured
          ? `Capture API fired → next NBA queued by CDH`
          : nbaReady
          ? `CDH returned ${stage.actions.length} actions · tap CTA to capture`
          : 'Awaiting CDH Real-Time Container…'}
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import type { Platform } from '../data/platforms';
import type { Persona } from '../data/types';
import type { NBAAction } from '../data/cdh';

interface Props {
  platform: Platform;
  persona: Persona;
  nbaReady: boolean;
  topAction: NBAAction;
  adaptiveScore: number;
  onCtaClick: () => void;
  capturing: boolean;
  captured: boolean;
  isLive?: boolean;
}

// Inline video player — rendered when CDH response includes videoURL
function VideoCreative({ action, accent }: { action: NBAAction; accent: string }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const ref = useRef<HTMLVideoElement>(null);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play(); setPlaying(true); }
  };

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ background: '#000' }}>
      {/* CDH media badge */}
      <div
        className="absolute top-1.5 left-1.5 z-10 text-[8px] font-bold px-1.5 py-0.5 rounded"
        style={{ background: `${accent}cc`, color: 'white' }}
      >
        CDH VIDEO · {action.videoType?.toUpperCase() ?? 'CREATIVE'}
      </div>
      <div className="absolute top-1.5 right-1.5 z-10 text-[8px] font-mono bg-black/70 text-white px-1 py-0.5 rounded">
        {action.videoDuration}
      </div>
      <video
        ref={ref}
        src={action.videoURL}
        muted={muted}
        loop
        playsInline
        className="w-full"
        style={{ maxHeight: 120, objectFit: 'cover' }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {/* Controls overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center gap-2 transition-opacity"
        style={{ opacity: playing ? 0 : 1, background: playing ? 'transparent' : 'rgba(0,0,0,0.35)' }}
        onClick={toggle}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm cursor-pointer"
          style={{ background: `${accent}cc` }}
        >
          {playing ? '⏸' : '▶'}
        </div>
      </div>
      {/* Bottom bar always visible */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1"
        style={{ background: 'rgba(0,0,0,0.6)' }}
      >
        <div className="text-[8px] text-white/80 font-mono truncate max-w-[130px]">{action.videoTitle}</div>
        <button
          onClick={(e) => { e.stopPropagation(); setMuted((m) => { if (ref.current) ref.current.muted = !m; return !m; }); }}
          className="text-[9px] text-white/60 ml-2 flex-shrink-0"
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
      {/* URL tag */}
      <div className="px-2 py-0.5 text-[7px] font-mono text-slate-500 truncate" style={{ background: '#0a0a0a' }}>
        {action.videoURL?.slice(0, 55)}…
      </div>
    </div>
  );
}

const SERVICE_CREATIVE: Record<string, { headline: string; body: string; speaker: string }> = {
  army: {
    headline: 'REME — engineer the Army.',
    body: 'Apprentice Vehicle Mechanics earn from day 1. Civilian-recognised qualifications.',
    speaker: 'Cpl Tom Whitfield, REME',
  },
  navy: {
    headline: 'Lead at sea. Engineering meets command.',
    body: 'Officer Insight Event — Female Leaders panel. Tue 21 May · Virtual · 287 confirmed.',
    speaker: 'Lt Cdr Emma Carter, Warfare Officer',
  },
  raf: {
    headline: 'Engineer the future of flight.',
    body: 'Apprentice Aircraft Technicians earn from year 1. Join the RAF today.',
    speaker: 'SAC Marcus Williams, Aircraft Tech',
  },
};

// Resolve creative by service (supports preset & custom personas)
function getCreative(persona: Persona) {
  return SERVICE_CREATIVE[persona.service] ?? SERVICE_CREATIVE.army;
}

function TikTokFeed({ platform, persona, nbaReady, topAction, adaptiveScore, onCtaClick, capturing, captured, isLive }: Props) {
  const mock = getCreative(persona);
  const headline = isLive && topAction.Label    ? topAction.Label    : mock.headline;
  const body     = isLive && topAction.Benefits ? topAction.Benefits : mock.body;
  const speaker  = isLive && topAction.Treatment ? topAction.Treatment : mock.speaker;
  return (
    <div className="flex-1 bg-black flex flex-col relative overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 text-white text-[10px] z-10">
        <span>Following</span>
        <span className="font-bold border-b border-white pb-0.5">For You</span>
        <span>🔍</span>
      </div>
      {/* Placeholder organic post behind */}
      <div className="flex-1 relative">
        {/* Organic ghost post */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="h-full flex items-end p-3"
            style={{ background: 'linear-gradient(180deg, #1a1a2e, #16213e)' }}
          >
            <div className="space-y-1">
              <div className="h-2 bg-white/20 rounded w-32" />
              <div className="h-2 bg-white/20 rounded w-24" />
            </div>
          </div>
        </div>

        {/* CDH-served sponsored post */}
        {!nbaReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-slate-600 text-[10px] animate-pulse">CDH deciding…</div>
          </div>
        )}
        {nbaReady && (
          <div className="absolute inset-0 slide-in flex flex-col justify-end">
            {topAction.videoURL ? (
              <div className="flex-1 flex flex-col justify-end">
                <VideoCreative action={topAction} accent={persona.color} />
              </div>
            ) : isLive && topAction.ImageURL ? (
              <div className="flex-1 overflow-hidden">
                <img
                  src={topAction.ImageURL}
                  alt={headline}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="flex-1"
                style={{ background: `linear-gradient(180deg, ${persona.color}33 0%, ${persona.color}99 100%)` }}
              />
            )}
            <div className="bg-black/80 p-3 space-y-2">
              <div className="text-white/50 text-[9px]">{platform.adNote} · NBA: {topAction.ActionID}</div>
              <div className="text-white font-bold text-sm leading-tight">{headline}</div>
              <div className="text-white/70 text-[10px]">{speaker}</div>
              <div className="text-white/60 text-[10px]">{body}</div>
              <button
                onClick={onCtaClick}
                disabled={capturing || captured}
                className="w-full py-2 rounded-lg text-white text-xs font-bold transition-all duration-200"
                style={{
                  background: captured ? '#22c55e' : capturing ? '#64748b' : persona.color,
                  transform: capturing ? 'scale(0.98)' : 'scale(1)',
                }}
              >
                {captured ? '✓ Interaction captured' : capturing ? 'Capturing…' : platform.cta}
              </button>
              <div className="text-[9px] text-slate-500 text-center font-mono">
                pAccept {(topAction.pAccept * 100).toFixed(0)}% · match {adaptiveScore}%
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Right side icons */}
      {nbaReady && (
        <div className="absolute right-2 bottom-24 flex flex-col gap-3 items-center">
          {['♥', '💬', '↗', '⋯'].map((icon) => (
            <div key={icon} className="text-white text-base opacity-80">{icon}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function FacebookFeed({ platform, persona, nbaReady, topAction, adaptiveScore, onCtaClick, capturing, captured, isLive }: Props) {
  const mock = getCreative(persona);
  const headline = isLive && topAction.Label     ? topAction.Label     : mock.headline;
  const body     = isLive && topAction.Benefits  ? topAction.Benefits  : mock.body;
  const speaker  = isLive && topAction.Treatment ? topAction.Treatment : mock.speaker;
  return (
    <div className="flex-1 overflow-auto" style={{ background: '#18191a' }}>
      <div className="p-2 space-y-2">
        {/* Organic ghost posts */}
        {[1].map((i) => (
          <div key={i} className="bg-[#242526] rounded-xl p-3 opacity-40">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-slate-600" />
              <div>
                <div className="h-2 bg-slate-600 rounded w-20 mb-1" />
                <div className="h-1.5 bg-slate-700 rounded w-14" />
              </div>
            </div>
            <div className="h-16 bg-slate-700 rounded-lg" />
          </div>
        ))}
        {/* CDH-served ad */}
        {!nbaReady && (
          <div className="bg-[#242526] rounded-xl p-4 text-center">
            <div className="text-slate-600 text-[10px] animate-pulse">CDH deciding…</div>
          </div>
        )}
        {nbaReady && (
          <div className="bg-[#242526] rounded-xl overflow-hidden slide-in">
            <div className="p-3 flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                style={{ background: persona.color }}
              >
                {persona.service === 'army' ? '⚔' : persona.service === 'raf' ? '✈' : '⚓'}
              </div>
              <div>
                <div className="text-white text-[11px] font-semibold">
                  {persona.service === 'army' ? 'British Army' : persona.service === 'raf' ? 'Royal Air Force' : 'Royal Navy'}
                </div>
                <div className="text-[#b0b3b8] text-[9px]">{platform.adNote} · {topAction.ActionID}</div>
              </div>
            </div>
            {topAction.videoURL ? (
              <VideoCreative action={topAction} accent={persona.color} />
            ) : isLive && topAction.ImageURL ? (
              <div className="h-24 overflow-hidden">
                <img src={topAction.ImageURL} alt={headline} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="h-24 flex items-end p-3"
                style={{ background: `linear-gradient(135deg, ${persona.color}88, ${persona.color})` }}
              >
                <div>
                  <div className="text-white font-bold text-sm">{headline}</div>
                  <div className="text-white/70 text-[10px]">{speaker}</div>
                </div>
              </div>
            )}
            <div className="p-3 border-t border-[#3a3b3c]">
              <div className="text-[#b0b3b8] text-[10px] mb-2">{body}</div>
              <button
                onClick={onCtaClick}
                disabled={capturing || captured}
                className="w-full py-1.5 rounded-lg text-white text-xs font-bold transition-all"
                style={{ background: captured ? '#22c55e' : capturing ? '#64748b' : '#1877f2' }}
              >
                {captured ? '✓ Captured' : capturing ? 'Capturing…' : platform.cta}
              </button>
            </div>
            <div className="px-3 pb-2 text-[9px] text-slate-600 font-mono">
              pAccept {(topAction.pAccept * 100).toFixed(0)}% · match {adaptiveScore}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InstagramFeed({ platform, persona, nbaReady, topAction, adaptiveScore, onCtaClick, capturing, captured, isLive }: Props) {
  const mock = getCreative(persona);
  const headline = isLive && topAction.Label     ? topAction.Label     : mock.headline;
  const speaker  = isLive && topAction.Treatment ? topAction.Treatment : mock.speaker;
  return (
    <div className="flex-1 bg-black flex flex-col relative overflow-hidden">
      {/* Nav */}
      <div className="flex items-center justify-between px-3 py-1.5 text-white text-[10px]">
        <span>{'←'}</span>
        <span className="font-bold">Reels</span>
        <span>📷</span>
      </div>
      <div className="flex-1 relative">
        {!nbaReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-slate-600 text-[10px] animate-pulse">Awaiting CDH…</div>
          </div>
        )}
        {nbaReady && (
          <div className="absolute inset-0 slide-in flex flex-col">
            {topAction.videoURL ? (
              <div className="flex-1 flex flex-col justify-center px-2 pt-2">
                <VideoCreative action={topAction} accent="#fd1d1d" />
              </div>
            ) : isLive && topAction.ImageURL ? (
              <div className="flex-1 overflow-hidden">
                <img src={topAction.ImageURL} alt={headline} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="flex-1"
                style={{ background: `linear-gradient(180deg, ${persona.color}44, ${persona.color}cc)` }}
              >
                <div className="p-3 text-center pt-8">
                  <div className="text-white font-bold text-sm">{headline}</div>
                  <div className="text-white/60 text-[10px] mt-1">{speaker}</div>
                </div>
              </div>
            )}
            <div className="bg-black/90 p-3">
              <div className="text-white/50 text-[9px] mb-1">{platform.adNote} · {topAction.ActionID}</div>
              <button
                onClick={onCtaClick}
                disabled={capturing || captured}
                className="w-full py-2 rounded-xl text-white text-xs font-bold transition-all"
                style={{ background: captured ? '#22c55e' : capturing ? '#64748b' : 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}
              >
                {captured ? '✓ Captured' : capturing ? 'Capturing…' : platform.cta}
              </button>
              <div className="text-[9px] text-slate-500 text-center font-mono mt-1">
                pAccept {(topAction.pAccept * 100).toFixed(0)}% · match {adaptiveScore}%
              </div>
            </div>
          </div>
        )}
        {/* Right icons */}
        {nbaReady && (
          <div className="absolute right-2 top-8 flex flex-col gap-4 items-center">
            {['❤️', '💬', '➤', '⋯'].map((icon) => (
              <div key={icon} className="text-white text-base">{icon}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LinkedInFeed({ platform, persona, nbaReady, topAction, adaptiveScore, onCtaClick, capturing, captured, isLive }: Props) {
  const mock = getCreative(persona);
  const headline = isLive && topAction.Label     ? topAction.Label     : mock.headline;
  const body     = isLive && topAction.Benefits  ? topAction.Benefits  : mock.body;
  const speaker  = isLive && topAction.Treatment ? topAction.Treatment : mock.speaker;
  return (
    <div className="flex-1 overflow-auto" style={{ background: '#1b1f23' }}>
      <div className="p-2 space-y-2">
        {/* Ghost organic */}
        <div className="bg-[#1e2228] rounded-xl p-3 opacity-40">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-600" />
            <div>
              <div className="h-2 bg-slate-600 rounded w-24 mb-1" />
              <div className="h-1.5 bg-slate-700 rounded w-16" />
            </div>
          </div>
          <div className="h-3 bg-slate-700 rounded w-3/4 mb-1" />
          <div className="h-3 bg-slate-700 rounded w-1/2" />
        </div>
        {/* CDH sponsored */}
        {!nbaReady && (
          <div className="bg-[#1e2228] rounded-xl p-4 text-center">
            <div className="text-slate-600 text-[10px] animate-pulse">CDH deciding…</div>
          </div>
        )}
        {nbaReady && (
          <div className="bg-[#1e2228] rounded-xl overflow-hidden slide-in border border-[#0a66c2]/30">
            <div className="p-3 flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                style={{ background: persona.color }}
              >
                {persona.avatar}
              </div>
              <div>
                <div className="text-white text-[11px] font-semibold">
                  {persona.service === 'army' ? 'British Army Careers' : persona.service === 'raf' ? 'Royal Air Force Careers' : 'Royal Navy Careers'}
                </div>
                <div className="text-[#8f9fad] text-[9px]">{platform.adNote}</div>
                <div className="text-[#8f9fad] text-[9px] font-mono">{topAction.ActionID}</div>
              </div>
            </div>
            {topAction.videoURL ? (
              <VideoCreative action={topAction} accent="#0a66c2" />
            ) : isLive && topAction.ImageURL ? (
              <div className="h-20 overflow-hidden">
                <img src={topAction.ImageURL} alt={headline} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="h-20 flex items-center p-3"
                style={{ background: `linear-gradient(90deg, ${persona.color}22, ${persona.color}55)` }}
              >
                <div>
                  <div className="text-white font-bold text-sm">{headline}</div>
                  <div className="text-white/60 text-[10px] mt-0.5">{speaker}</div>
                </div>
              </div>
            )}
            <div className="p-3">
              <div className="text-[#8f9fad] text-[10px] mb-2">{body}</div>
              <button
                onClick={onCtaClick}
                disabled={capturing || captured}
                className="w-full py-1.5 rounded-full text-white text-xs font-bold border transition-all"
                style={{
                  background: captured ? '#22c55e' : capturing ? 'transparent' : persona.color,
                  borderColor: captured ? '#22c55e' : persona.color,
                  color: 'white',
                }}
              >
                {captured ? '✓ Interaction captured' : capturing ? 'Capturing…' : platform.cta}
              </button>
            </div>
            <div className="px-3 pb-2 text-[9px] text-slate-600 font-mono">
              pAccept {(topAction.pAccept * 100).toFixed(0)}% · match {adaptiveScore}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function YouTubeFeed({ platform, persona, nbaReady, topAction, adaptiveScore, onCtaClick, capturing, captured, isLive }: Props) {
  const mock = getCreative(persona);
  const headline = isLive && topAction.Label     ? topAction.Label     : mock.headline;
  const body     = isLive && topAction.Benefits  ? topAction.Benefits  : mock.body;
  const speaker  = isLive && topAction.Treatment ? topAction.Treatment : mock.speaker;
  return (
    <div className="flex-1 overflow-auto bg-[#0f0f0f]">
      <div className="p-2 space-y-2">
        {/* Ghost video thumbnails */}
        <div className="opacity-40 space-y-2">
          <div className="bg-[#1e1e1e] rounded-lg h-24 flex items-center justify-center">
            <div className="text-slate-600 text-xl">▶</div>
          </div>
          <div className="h-2 bg-[#1e1e1e] rounded w-3/4" />
          <div className="h-2 bg-[#1e1e1e] rounded w-1/2" />
        </div>
        {/* Pre-roll ad */}
        {!nbaReady && (
          <div className="bg-[#1e1e1e] rounded-lg p-4 text-center">
            <div className="text-slate-600 text-[10px] animate-pulse">CDH deciding pre-roll…</div>
          </div>
        )}
        {nbaReady && (
          <div className="bg-[#1e1e1e] rounded-lg overflow-hidden slide-in">
            {topAction.videoURL ? (
              <div className="relative">
                <VideoCreative action={topAction} accent="#ff0000" />
                <div className="absolute top-1.5 right-1.5 bg-black/70 text-white text-[8px] px-1.5 py-0.5 rounded z-20">
                  Ad · Skip in 5s
                </div>
              </div>
            ) : isLive && topAction.ImageURL ? (
              <div className="h-28 overflow-hidden relative">
                <img src={topAction.ImageURL} alt={headline} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                  Ad · Skip in 5s
                </div>
              </div>
            ) : (
              <div
                className="h-28 flex flex-col items-center justify-center relative"
                style={{ background: `linear-gradient(135deg, ${persona.color}99, ${persona.color})` }}
              >
                <div className="text-white font-bold text-sm text-center px-3">{headline}</div>
                <div className="text-white/70 text-[10px] mt-1">{speaker}</div>
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                  Ad · Skip in 5s
                </div>
                <div className="absolute bottom-2 left-2 text-[9px] text-white/50 font-mono">{topAction.ActionID}</div>
              </div>
            )}
            <div className="p-3">
              <div className="text-[#aaa] text-[10px] mb-2">{body}</div>
              <div className="flex gap-2">
                <button
                  onClick={onCtaClick}
                  disabled={capturing || captured}
                  className="flex-1 py-1.5 rounded text-white text-xs font-bold transition-all"
                  style={{ background: captured ? '#22c55e' : capturing ? '#64748b' : '#ff0000' }}
                >
                  {captured ? '✓ Captured' : capturing ? 'Capturing…' : platform.cta}
                </button>
                <button className="px-3 py-1.5 rounded border border-[#333] text-[#aaa] text-xs">
                  Skip →
                </button>
              </div>
              <div className="text-[9px] text-slate-600 font-mono mt-1">
                pAccept {(topAction.pAccept * 100).toFixed(0)}% · match {adaptiveScore}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SnapchatFeed({ platform, persona, nbaReady, topAction, adaptiveScore, onCtaClick, capturing, captured, isLive }: Props) {
  const mock = getCreative(persona);
  const headline = isLive && topAction.Label     ? topAction.Label     : mock.headline;
  const body     = isLive && topAction.Benefits  ? topAction.Benefits  : mock.body;
  const speaker  = isLive && topAction.Treatment ? topAction.Treatment : mock.speaker;
  return (
    <div className="flex-1 bg-black flex flex-col relative overflow-hidden">
      {/* Snap story progress bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-0.5 px-2 pt-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full" style={{ background: i === 2 ? 'white' : 'rgba(255,255,255,0.35)' }} />
        ))}
      </div>
      {/* Top bar */}
      <div className="absolute top-3 left-0 right-0 z-20 flex items-center justify-between px-3 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-black font-black text-[10px]">
            👻
          </div>
          <div>
            <div className="text-white font-bold text-[10px]">
              {persona.service === 'army' ? 'British Army' : persona.service === 'raf' ? 'Royal Air Force' : 'Royal Navy'}
            </div>
            <div className="text-white/60 text-[8px]">{platform.adNote}</div>
          </div>
        </div>
        <div className="text-white/60 text-lg">✕</div>
      </div>

      {/* Full-screen snap content */}
      {!nbaReady && (
        <div className="flex-1 flex items-center justify-center" style={{ background: '#1a1a1a' }}>
          <div className="text-slate-600 text-[10px] animate-pulse">CDH deciding snap…</div>
        </div>
      )}
      {nbaReady && (
        <div className="flex-1 slide-in flex flex-col">
          {/* Snap visual area */}
          {topAction.videoURL ? (
            <div className="flex-1 flex flex-col justify-center px-2 pt-10">
              <VideoCreative action={topAction} accent="#FFFC00" />
            </div>
          ) : isLive && topAction.ImageURL ? (
            <div className="flex-1 overflow-hidden pt-10">
              <img src={topAction.ImageURL} alt={headline} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div
              className="flex-1 flex flex-col items-center justify-center px-4 pt-10"
              style={{ background: `linear-gradient(180deg, ${persona.color}cc, ${persona.color}44)` }}
            >
              <div className="text-white font-black text-base text-center leading-tight">{headline}</div>
              <div className="text-white/70 text-[10px] mt-2 text-center">{speaker}</div>
            </div>
          )}
          {/* Bottom CTA */}
          <div className="pb-4 px-3 space-y-2">
            <div className="text-white/60 text-[9px] text-center">{body}</div>
            <button
              onClick={onCtaClick}
              disabled={capturing || captured}
              className="w-full py-2.5 rounded-2xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-1"
              style={{
                background: captured ? '#22c55e' : capturing ? '#64748b' : '#FFFC00',
                color: captured || capturing ? 'white' : '#000',
                transform: capturing ? 'scale(0.98)' : 'scale(1)',
              }}
            >
              {captured ? '✓ Interaction captured' : capturing ? 'Capturing…' : (
                <><span>↑</span> {platform.cta}</>
              )}
            </button>
            <div className="text-[8px] text-slate-600 text-center font-mono">
              {topAction.ActionID} · pAccept {(topAction.pAccept * 100).toFixed(0)}% · match {adaptiveScore}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WhatsAppFeed({ platform, persona, nbaReady, topAction, adaptiveScore, onCtaClick, capturing, captured, isLive }: Props) {
  const mock = getCreative(persona);
  const headline = isLive && topAction.Label     ? topAction.Label     : mock.headline;
  const body     = isLive && topAction.Benefits  ? topAction.Benefits  : mock.body;
  const speaker  = isLive && topAction.Treatment ? topAction.Treatment : mock.speaker;
  const serviceName = persona.service === 'army' ? 'British Army Careers' : persona.service === 'raf' ? 'RAF Careers' : 'Royal Navy Careers';
  return (
    <div className="flex-1 overflow-auto flex flex-col" style={{ background: '#0b141a' }}>
      {/* WA Channel header */}
      <div className="px-3 py-2 flex items-center gap-2 flex-shrink-0" style={{ background: '#1f2c34', borderBottom: '1px solid #2a3942' }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0"
          style={{ background: persona.color }}>
          {persona.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-[11px] font-semibold truncate">{serviceName}</div>
          <div className="text-[#8696a0] text-[8px] flex items-center gap-1">
            <span style={{ color: '#25D366' }}>✓</span> Official Business Channel
          </div>
        </div>
        <div className="text-[#8696a0] text-sm">⋯</div>
      </div>

      <div className="flex-1 p-2 space-y-2 overflow-auto">
        {/* Ghost older messages */}
        <div className="opacity-30 space-y-1.5">
          {[60, 45].map((w) => (
            <div key={w} className="flex justify-center">
              <div className="h-1.5 rounded-full bg-slate-700" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>

        {/* Date divider */}
        <div className="flex items-center justify-center">
          <div className="text-[8px] px-2 py-0.5 rounded-full" style={{ background: '#1f2c34', color: '#8696a0' }}>Today</div>
        </div>

        {/* CDH-served channel post */}
        {!nbaReady && (
          <div className="rounded-lg p-3 text-center" style={{ background: '#1f2c34' }}>
            <div className="text-[#8696a0] text-[9px] animate-pulse">CDH NBA deciding…</div>
          </div>
        )}
        {nbaReady && (
          <div className="slide-in rounded-lg overflow-hidden" style={{ background: '#1f2c34' }}>
            {/* CDH badge */}
            <div className="px-3 pt-2 pb-1 flex items-center gap-1.5">
              <div className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#25D36620', color: '#25D366' }}>
                CDH · {platform.adNote}
              </div>
              <div className="text-[8px] font-mono text-slate-600 truncate">{topAction.ActionID}</div>
            </div>

            {/* Video or image creative */}
            {topAction.videoURL ? (
              <div className="mx-2">
                <VideoCreative action={topAction} accent="#25D366" />
              </div>
            ) : isLive && topAction.ImageURL ? (
              <div className="mx-2 rounded-lg h-20 overflow-hidden">
                <img src={topAction.ImageURL} alt={headline} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="mx-2 rounded-lg h-20 flex items-center justify-between px-3"
                style={{ background: `linear-gradient(135deg, ${persona.color}44, ${persona.color}99)` }}
              >
                <div>
                  <div className="text-white font-bold text-xs leading-tight">{headline}</div>
                  <div className="text-white/60 text-[9px] mt-0.5">{speaker}</div>
                </div>
              </div>
            )}

            {/* Message body */}
            <div className="px-3 py-2 space-y-1">
              <div className="text-white text-[10px] font-semibold">{headline}</div>
              <div className="text-[#8696a0] text-[9px] leading-snug">{body}</div>
              <div className="text-[8px] font-mono" style={{ color: '#25D366' }}>
                pAccept {(topAction.pAccept * 100).toFixed(0)}% · match {adaptiveScore}% · CDH NBA Rank 1
              </div>
            </div>

            {/* CTA button */}
            <div className="px-3 pb-3">
              <button
                onClick={onCtaClick}
                disabled={capturing || captured}
                className="w-full py-2 rounded-lg text-xs font-bold transition-all duration-200"
                style={{
                  background: captured ? '#22c55e' : capturing ? '#2a3942' : '#25D36620',
                  color: captured ? 'white' : capturing ? '#8696a0' : '#25D366',
                  border: `1px solid ${captured ? '#22c55e' : '#25D36640'}`,
                  transform: capturing ? 'scale(0.98)' : 'scale(1)',
                }}
              >
                {captured ? '✓ Interaction captured' : capturing ? 'Firing capture API…' : platform.cta}
              </button>
            </div>

            {/* Timestamp */}
            <div className="px-3 pb-2 text-right text-[8px]" style={{ color: '#8696a0' }}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <span style={{ color: '#25D366' }}>✓✓</span>
            </div>
          </div>
        )}
      </div>

      {/* WA message bar (decorative) */}
      <div className="px-2 py-2 flex items-center gap-1.5 flex-shrink-0" style={{ background: '#1f2c34' }}>
        <div className="flex-1 rounded-full px-3 py-1.5 text-[9px]" style={{ background: '#2a3942', color: '#8696a0' }}>
          Message {serviceName}…
        </div>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm" style={{ background: '#25D366' }}>🎤</div>
      </div>
    </div>
  );
}

export default function SocialFeed(props: Props) {
  switch (props.platform.id) {
    case 'tiktok': return <TikTokFeed {...props} />;
    case 'facebook': return <FacebookFeed {...props} />;
    case 'instagram': return <InstagramFeed {...props} />;
    case 'linkedin': return <LinkedInFeed {...props} />;
    case 'youtube': return <YouTubeFeed {...props} />;
    case 'snapchat': return <SnapchatFeed {...props} />;
    case 'whatsapp': return <WhatsAppFeed {...props} />;
    default: return <TikTokFeed {...props} />;
  }
}

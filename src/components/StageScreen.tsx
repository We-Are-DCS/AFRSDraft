import { Building2, Globe, Smartphone, MessageSquare, Mail, Link } from 'lucide-react';
import type { StageConfig } from '../data/cdh';
import type { Persona } from '../data/types';
import CDHLiveCard from './CDHLiveCard';

interface Props {
  stage: StageConfig;
  persona: Persona;
  nbaReady: boolean;
  capturing: boolean;
  captured: boolean;
  onCtaClick: () => void;
  isLive?: boolean;
}

function ChannelIcon({ channel }: { channel: string }) {
  if (channel === 'IN_PERSON') return <Building2 size={14} />;
  if (channel === 'WEB')       return <Globe size={14} />;
  if (channel === 'APP')       return <Smartphone size={14} />;
  if (channel === 'SMS')       return <MessageSquare size={14} />;
  if (channel === 'EMAIL')     return <Mail size={14} />;
  return <Link size={14} />;
}

export default function StageScreen({ stage, persona, nbaReady, capturing, captured, onCtaClick, isLive }: Props) {
  const topAction = stage.actions[0];

  const ctaLabel = captured
    ? '✓ Interaction captured — next NBA queued'
    : capturing
    ? 'Firing capture API…'
    : topAction?.ActionName?.split(' ').slice(0, 5).join(' ') + ' →';

  return (
    <div className="flex-1 overflow-auto bg-slate-950">
      {!nbaReady && (
        <div className="p-3 space-y-3 animate-pulse">
          <div className="h-16 bg-slate-800 rounded-xl" />
          <div className="h-12 bg-slate-800 rounded-xl" />
          <div className="h-8 bg-slate-800 rounded-xl" />
          <div className="text-slate-600 text-[10px] text-center mt-2">CDH deciding…</div>
        </div>
      )}
      {nbaReady && (
        <div className="p-3 space-y-2 slide-in">

          {/* Stage header */}
          <div
            className="rounded-xl p-2.5"
            style={{ background: `${persona.color}18`, border: `1px solid ${persona.color}30` }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: persona.color }}>
                {stage.phase} · {stage.name}
              </div>
              <div className="text-[9px] text-slate-500">{stage.dayRange}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <ChannelIcon channel={stage.channel} />
              <div className="text-white text-[10px] font-semibold leading-tight truncate">
                {stage.touchpoint.replace(/_/g, ' ')}
              </div>
            </div>
          </div>

          {/* Propensity row */}
          <div className="bg-slate-800 rounded-xl p-2.5">
            <div className="flex justify-between items-center mb-1.5">
              <div className="text-slate-400 text-[9px]">CDH PROPENSITY</div>
              <div className="font-black text-sm" style={{ color: persona.color }}>{stage.propensity}%</div>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${stage.propensity}%`, background: persona.color }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <div className="text-[9px] text-slate-600">Adaptive score</div>
              <div className="text-[9px] font-semibold text-slate-400">{stage.adaptiveScore}%</div>
            </div>
          </div>

          {/* NBA action card — CDHLiveCard when live, mock card otherwise */}
          {isLive ? (
            <div className="bg-slate-800 rounded-xl overflow-hidden">
              <CDHLiveCard
                action={topAction}
                persona={persona}
                rank={1}
                total={stage.actions.length}
              />
            </div>
          ) : (
            <div className="bg-slate-800 rounded-xl p-2.5">
              <div className="text-slate-400 text-[9px] mb-1.5">
                CDH NBA · RANK 1 OF {stage.actions.length}
              </div>
              <div className="text-white text-[10px] font-semibold leading-snug mb-1">
                {topAction.ActionName}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[9px] text-slate-500">{topAction.Channel} · {topAction.Direction}</div>
                <div
                  className="text-[10px] font-black px-1.5 py-0.5 rounded text-white"
                  style={{ background: persona.color }}
                >
                  {(topAction.pAccept * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          )}

          {/* Recent signals */}
          <div className="bg-slate-800 rounded-xl p-2.5">
            <div className="text-slate-400 text-[9px] mb-1.5">CANDIDATE SIGNALS · {stage.signals.length} received</div>
            <div className="space-y-1">
              {stage.signals.slice(-3).map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="text-cyan-400 text-[9px] font-mono truncate max-w-[100px]">{s.signal}</div>
                  <div className="text-yellow-400 text-[9px] font-mono truncate max-w-[80px]">{String(s.value)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Outcome badge if set */}
          {stage.outcome && (
            <div className="rounded-xl p-2 text-center" style={{ background: '#22c55e15', border: '1px solid #22c55e30' }}>
              <div className="text-green-400 text-[9px] font-semibold">✓ {stage.outcome}</div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={onCtaClick}
            disabled={capturing || captured}
            className="w-full py-2.5 rounded-xl text-white text-[10px] font-bold transition-all duration-200 leading-tight px-2"
            style={{
              background: captured ? '#22c55e' : capturing ? '#475569' : persona.color,
              transform: capturing ? 'scale(0.98)' : 'scale(1)',
            }}
          >
            {ctaLabel}
          </button>
        </div>
      )}
    </div>
  );
}

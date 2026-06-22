/**
 * MarketerView — the Service Marketer perspective on the candidate journey.
 *
 * Shows outbound campaign logic (Stage 1) and inbound decisioning (Stages 2+):
 *  • CDH container + channel + touchpoint being called
 *  • Rank-1 NBA action with full reasoning — treatment, segment, pAccept
 *  • Engagement policy gate status (Eligible / Consent / Fatigue / D&I)
 *  • "Intended vs Served" validation panel
 *  • Candidate signals feeding CDH
 */

import { Upload, Download, Radio, Users, Palette, Loader, ClipboardCheck, CheckCircle, Music, Globe, Camera, Briefcase, PlayCircle, Ghost, MessageCircle } from 'lucide-react';
import type { StageConfig } from '../data/cdh';
import type { Persona } from '../data/types';
import type { Platform } from '../data/platforms';

function PlatformIcon({ id, size = 10 }: { id: string; size?: number }) {
  if (id === 'tiktok')    return <Music size={size} />;
  if (id === 'facebook')  return <Globe size={size} />;
  if (id === 'instagram') return <Camera size={size} />;
  if (id === 'linkedin')  return <Briefcase size={size} />;
  if (id === 'youtube')   return <PlayCircle size={size} />;
  if (id === 'snapchat')  return <Ghost size={size} />;
  if (id === 'whatsapp')  return <MessageCircle size={size} />;
  return <Globe size={size} />;
}

interface Props {
  stage: StageConfig;
  persona: Persona;
  platform: Platform;
  nbaReady: boolean;
}

const POLICY_GATES = [
  { key: 'Eligible',  label: 'Eligible',       desc: 'Meets criteria for service & role' },
  { key: 'Consented', label: 'Consented',       desc: 'Data consent recorded' },
  { key: 'Fatigue',   label: 'Fatigue check',   desc: 'Contact frequency within limits' },
  { key: 'Disparity', label: 'D&I Disparity',   desc: 'Ratio 0.91 ≥ 0.85 threshold' },
];

export default function MarketerView({ stage, persona, platform, nbaReady }: Props) {
  const topAction   = stage.actions[0];
  const isStage1    = stage.id === 1;
  const atrsRef     = `ATRS-2026-${String(stage.id).padStart(3, '0')}-${persona.avatar}`;

  return (
    <div className="w-full space-y-4 max-w-2xl mx-auto">

      {/* ── Campaign / decisioning header ──────────────────────────────────── */}
      <div className="rounded-2xl p-4" style={{ background: `${persona.color}0f`, border: `1px solid ${persona.color}25` }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <div className="text-xs font-black uppercase tracking-widest" style={{ color: persona.color }}>
              <span className="inline-flex items-center gap-1">{isStage1 ? <><Upload size={10} />Outbound Campaign</> : <><Download size={10} />Inbound Decisioning</>} · {stage.shortName}</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{stage.containerName}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-slate-500">D&I Ratio</div>
            <div className="text-base font-black text-green-400">0.91</div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {isStage1 && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: platform.color + '25', color: platform.color }}>
              <span className="inline-flex items-center gap-1"><PlatformIcon id={platform.id} />{platform.label} · {platform.adFormat}</span>
            </span>
          )}
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-800 text-slate-400">
            <span className="inline-flex items-center gap-1"><Radio size={10} />{stage.channel} · {stage.touchpoint.replace(/_/g, ' ')}</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-800 text-slate-400">
            {stage.dayRange}
          </span>
        </div>
      </div>

      {/* ── CDH Rank-1 decision ─────────────────────────────────────────────── */}
      <div className="rounded-2xl p-4 bg-slate-900">
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-3">
          CDH Decision · Top-Ranked Action
        </div>

        {nbaReady && topAction ? (
          <>
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base flex-shrink-0"
                style={{ background: persona.color }}
              >
                1
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm leading-tight">{topAction.ActionName}</div>
                <div className="text-slate-500 text-[10px] font-mono mt-0.5">{topAction.ActionID}</div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{topAction.Treatment}</span>
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded inline-flex items-center gap-1"><Radio size={8} />{topAction.Channel}</span>
                  {topAction.AudienceSegment && (
                    <span className="text-[9px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded inline-flex items-center gap-1"><Users size={8} />{topAction.AudienceSegment}</span>
                  )}
                  {topAction.ContentFragmentID && (
                    <span className="text-[9px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded inline-flex items-center gap-1"><Palette size={8} />{topAction.ContentFragmentID.slice(0, 24)}</span>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-black leading-none" style={{ color: persona.color }}>
                  {(topAction.pAccept * 100).toFixed(0)}%
                </div>
                <div className="text-[9px] text-slate-600 mt-0.5">pAccept</div>
                <div className="text-[9px] text-slate-500 mt-0.5">£{topAction.pValue.toFixed(2)}</div>
              </div>
            </div>

            {/* Propensity bar */}
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${topAction.pAccept * 100}%`, background: persona.color }}
              />
            </div>

            {/* Lower-ranked / suppressed actions */}
            {stage.actions.length > 1 && (
              <div className="pt-3 border-t border-slate-800">
                <div className="text-[9px] text-slate-600 uppercase tracking-wider mb-2">Ranked / Suppressed</div>
                <div className="space-y-1.5">
                  {stage.actions.slice(1).map((a, i) => (
                    <div key={a.ActionID} className="flex items-center gap-2 text-[10px]">
                      <span
                        className="w-4 h-4 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                      >{i + 2}</span>
                      <span className="text-slate-500 flex-1 truncate">{a.ActionName}</span>
                      <span className="text-[9px] font-mono bg-slate-800 text-slate-600 px-1.5 py-0.5 rounded">{a.Treatment}</span>
                      <span className="text-slate-600 font-mono">{(a.pAccept * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-6 text-center text-slate-600 text-[11px]">
            <div className="animate-pulse mb-1 flex justify-center"><Loader size={14} /></div>
            Awaiting CDH response…
          </div>
        )}
      </div>

      {/* ── Engagement policy gates ─────────────────────────────────────────── */}
      <div className="rounded-2xl p-4 bg-slate-900">
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-3">
          Engagement Policy Gates
        </div>
        <div className="grid grid-cols-2 gap-2">
          {POLICY_GATES.map((gate) => (
            <div
              key={gate.key}
              className="flex items-center gap-2 p-2.5 rounded-xl"
              style={{ background: '#22c55e0a', border: '1px solid #22c55e25' }}
            >
              <span className="text-green-400 font-bold text-xs flex-shrink-0">✓</span>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-white leading-tight">{gate.label}</div>
                <div className="text-[9px] text-slate-500 leading-tight mt-0.5">{gate.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-[9px] font-mono text-slate-700">{atrsRef} · All gates passed · ATRS-audited</div>
      </div>

      {/* ── Intended vs Served ──────────────────────────────────────────────── */}
      <div className="rounded-2xl p-4 bg-slate-900">
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-3">
          Intended vs Served
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl" style={{ background: '#3b82f615', border: '1px solid #3b82f630' }}>
            <div className="text-[9px] text-blue-400 font-bold mb-2 flex items-center gap-1"><ClipboardCheck size={9} />Configured</div>
            <div className="text-[10px] text-slate-400 space-y-1.5">
              <div>Container <span className="text-white font-mono block truncate">{stage.containerName.split('_').slice(-2).join('_')}</span></div>
              <div>Channel <span className="text-white">{stage.channel}</span></div>
              {topAction && <div>Treatment <span className="text-white font-mono">{topAction.Treatment}</span></div>}
            </div>
          </div>
          <div className="p-3 rounded-xl" style={{ background: '#22c55e15', border: '1px solid #22c55e30' }}>
            <div className="text-[9px] text-green-400 font-bold mb-2 flex items-center gap-1"><CheckCircle size={9} />Served</div>
            <div className="text-[10px] text-slate-400 space-y-1.5">
              {nbaReady && topAction ? (
                <>
                  <div>Action <span className="text-white font-semibold block leading-tight">{topAction.ActionName}</span></div>
                  <div>pAccept <span className="font-bold" style={{ color: persona.color }}>{(topAction.pAccept * 100).toFixed(0)}%</span></div>
                  <div>Rank <span className="text-white">1 of {stage.actions.length}</span></div>
                </>
              ) : (
                <div className="text-slate-600 italic">Awaiting response…</div>
              )}
            </div>
          </div>
        </div>
        {nbaReady && (
          <div
            className="mt-2 p-2 rounded-lg text-[9px] text-green-400"
            style={{ background: '#22c55e0a', border: '1px solid #22c55e20' }}
          >
            ✓ No policy overrides — intended action served as configured
          </div>
        )}
      </div>

      {/* ── Candidate signals ───────────────────────────────────────────────── */}
      {stage.signals.length > 0 && (
        <div className="rounded-2xl p-4 bg-slate-900">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            Signals Feeding CDH · {stage.signals.length} active
          </div>
          <div className="space-y-1.5">
            {stage.signals.map((sig, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px]">
                <span className="text-slate-700 flex-shrink-0">→</span>
                <span className="text-slate-400 flex-1">{sig.signal}</span>
                <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-[9px]">
                  {String(sig.value)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[9px] text-slate-600">
            Propensity {stage.propensity}% · Adaptive {stage.adaptiveScore}% · {stage.outcome}
          </div>
        </div>
      )}

    </div>
  );
}

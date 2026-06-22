import type { NBAAction } from '../data/cdh';
import type { Persona } from '../data/types';

interface Props {
  action: NBAAction;
  persona: Persona;
  rank: number;
  total: number;
}

export default function CDHLiveCard({ action, persona, rank, total }: Props) {
  return (
    <div className="flex flex-col gap-2 p-2.5">

      {/* Live badge */}
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-green-400">
          CDH Live · Rank {rank} of {total}
        </span>
      </div>

      {/* Image */}
      {action.ImageURL && (
        <div className="rounded-xl overflow-hidden bg-slate-800 w-full aspect-video">
          <img
            src={action.ImageURL}
            alt={action.Label ?? action.ActionName}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Label — header */}
      {action.Label && (
        <div
          className="text-[13px] font-black leading-snug"
          style={{ color: persona.color }}
        >
          {action.Label}
        </div>
      )}

      {/* Treatment */}
      {action.Treatment && (
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
          {action.Treatment}
        </div>
      )}

      {/* Benefits */}
      {action.Benefits && (
        <div className="text-[10px] text-slate-300 leading-relaxed">
          {action.Benefits}
        </div>
      )}

      {/* Fallback — show ActionName if no Label/Benefits returned */}
      {!action.Label && !action.Benefits && (
        <>
          <div className="text-white text-[11px] font-semibold leading-snug">
            {action.ActionName}
          </div>
          <div className="text-slate-500 text-[9px]">
            {action.Treatment} · pAccept {(action.pAccept * 100).toFixed(0)}%
          </div>
        </>
      )}

      {/* pAccept pill */}
      <div className="flex items-center justify-between mt-0.5">
        <div className="text-[9px] text-slate-600">{action.Channel} · {action.Direction}</div>
        <div
          className="text-[10px] font-black px-1.5 py-0.5 rounded text-white"
          style={{ background: persona.color }}
        >
          {(action.pAccept * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
}

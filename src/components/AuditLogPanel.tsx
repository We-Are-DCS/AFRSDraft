import { useEffect, useState } from 'react';
import { X, Download, Trash2, ShieldCheck } from 'lucide-react';
import {
  getAuditLog,
  clearAuditLog,
  exportAuditJson,
  exportAuditCsv,
  AUDIT_UPDATED_EVENT,
  type AuditRecord,
} from '../auth/auditLog';

interface Props {
  onClose: () => void;
}

const EVENT_LABEL: Record<AuditRecord['event'], { label: string; color: string }> = {
  login_success: { label: 'Sign-in', color: '#22c55e' },
  login_failure: { label: 'Sign-in failed', color: '#ef4444' },
  logout: { label: 'Sign-out', color: '#94a3b8' },
};

function fmt(ts: string): string {
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? ts : d.toLocaleString();
}

export default function AuditLogPanel({ onClose }: Props) {
  const [records, setRecords] = useState<AuditRecord[]>(() => getAuditLog());

  // Keep the table live as new events are logged.
  useEffect(() => {
    const refresh = () => setRecords(getAuditLog());
    window.addEventListener(AUDIT_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(AUDIT_UPDATED_EVENT, refresh);
  }, []);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleClear = () => {
    if (window.confirm('Clear the entire audit trail on this device? This cannot be undone.')) {
      clearAuditLog();
    }
  };

  const newestFirst = [...records].reverse();

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ background: 'rgba(2,6,16,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col"
        style={{
          maxHeight: '85vh',
          background: 'rgba(13,20,36,0.98)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={18} style={{ color: '#16d0c5' }} />
            <div>
              <div className="text-sm font-semibold text-white">Authentication Audit Trail</div>
              <div className="text-[11px]" style={{ color: '#64748b' }}>
                {records.length} event{records.length === 1 ? '' : 's'} · this device
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportAuditCsv}
              disabled={records.length === 0}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors disabled:opacity-40"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#cbd5e1' }}
              title="Export CSV"
            >
              <Download size={13} /> CSV
            </button>
            <button
              onClick={exportAuditJson}
              disabled={records.length === 0}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors disabled:opacity-40"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#cbd5e1' }}
              title="Export JSON"
            >
              <Download size={13} /> JSON
            </button>
            <button
              onClick={handleClear}
              disabled={records.length === 0}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors disabled:opacity-40"
              style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}
              title="Clear audit trail"
            >
              <Trash2 size={13} /> Clear
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-auto">
          {newestFirst.length === 0 ? (
            <div className="px-5 py-16 text-center text-sm" style={{ color: '#475569' }}>
              No authentication events recorded yet.
            </div>
          ) : (
            <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color: '#475569', background: 'rgba(255,255,255,0.02)' }}
                >
                  <th className="px-5 py-2.5 font-semibold">Time</th>
                  <th className="px-3 py-2.5 font-semibold">Event</th>
                  <th className="px-3 py-2.5 font-semibold">Method</th>
                  <th className="px-3 py-2.5 font-semibold">User</th>
                  <th className="px-5 py-2.5 font-semibold">Detail</th>
                </tr>
              </thead>
              <tbody>
                {newestFirst.map((r) => {
                  const meta = EVENT_LABEL[r.event];
                  return (
                    <tr
                      key={r.id}
                      style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <td className="px-5 py-2.5 text-[12px] whitespace-nowrap" style={{ color: '#94a3b8' }}>
                        {fmt(r.ts)}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="inline-block px-2 py-0.5 rounded text-[10px] font-bold"
                          style={{ background: `${meta.color}1f`, color: meta.color }}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-[12px] uppercase" style={{ color: '#cbd5e1' }}>
                        {r.method}
                      </td>
                      <td className="px-3 py-2.5 text-[12px]" style={{ color: '#e2e8f0' }}>
                        <div className="font-medium">{r.userName || '—'}</div>
                        {r.userEmail && (
                          <div className="text-[11px]" style={{ color: '#64748b' }}>
                            {r.userEmail}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-2.5 text-[11px]" style={{ color: '#64748b' }}>
                        {r.detail || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

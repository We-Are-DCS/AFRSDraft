/**
 * Lightweight client-side audit trail for authentication events.
 *
 * Records persist in localStorage (survives reload, per-device) and are also
 * POSTed to an optional audit endpoint when VITE_AUDIT_ENDPOINT is configured,
 * so the trail can be centralised once a backend exists — without wiring one now.
 */

export type AuditEvent = 'login_success' | 'login_failure' | 'logout';
export type AuthMethod = 'entra' | 'demo' | 'unknown';

export interface AuditRecord {
  id: string;
  ts: string; // ISO 8601 timestamp
  event: AuditEvent;
  method: AuthMethod;
  userId?: string;
  userName?: string;
  userEmail?: string;
  detail?: string;
  userAgent: string;
}

const STORAGE_KEY = 'arfs-audit-log-v1';
const MAX_RECORDS = 500;
/** Fired whenever a record is appended, so an open viewer can refresh live. */
export const AUDIT_UPDATED_EVENT = 'arfs-audit-updated';

const auditEndpoint = import.meta.env.VITE_AUDIT_ENDPOINT as string | undefined;

export function getAuditLog(): AuditRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuditRecord[]) : [];
  } catch {
    return [];
  }
}

export function clearAuditLog(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(AUDIT_UPDATED_EVENT));
}

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    // Fallback for older browsers without crypto.randomUUID.
    return `a-${Date.now()}-${Math.floor(Math.random() * 1e9).toString(36)}`;
  }
}

/** Fire-and-forget POST to the configured audit endpoint. Never throws. */
function shipToEndpoint(record: AuditRecord): void {
  if (!auditEndpoint) return;
  try {
    void fetch(auditEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
      // keepalive lets the request complete even when logout navigates away.
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* swallow — auditing must never break the app */
  }
}

export function logAudit(input: Omit<AuditRecord, 'id' | 'ts' | 'userAgent'>): AuditRecord {
  const record: AuditRecord = {
    id: newId(),
    ts: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    ...input,
  };

  try {
    const log = getAuditLog();
    log.push(record);
    // Keep only the most recent MAX_RECORDS entries.
    const capped = log.slice(-MAX_RECORDS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
  } catch {
    /* localStorage full / unavailable — still attempt the endpoint */
  }

  shipToEndpoint(record);
  window.dispatchEvent(new CustomEvent(AUDIT_UPDATED_EVENT));
  return record;
}

// ── Exports ──────────────────────────────────────────────────────────────────

function triggerDownload(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportAuditJson(): void {
  triggerDownload(
    `arfs-audit-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(getAuditLog(), null, 2),
    'application/json',
  );
}

export function exportAuditCsv(): void {
  const cols: (keyof AuditRecord)[] = [
    'ts',
    'event',
    'method',
    'userName',
    'userEmail',
    'userId',
    'detail',
    'userAgent',
  ];
  const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = getAuditLog().map((r) => cols.map((c) => escape(r[c])).join(','));
  const csv = [cols.join(','), ...rows].join('\r\n');
  triggerDownload(`arfs-audit-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv');
}

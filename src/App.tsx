import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Sword, Anchor, Plane,
  Target, BarChart2, Smartphone, Monitor, Zap,
  ChevronLeft, ChevronRight, Pencil, Plus, X as XIcon,
  Music, Camera, Briefcase, PlayCircle, Ghost, MessageCircle, Globe,
} from 'lucide-react';
import { personas } from './data/personas';
import { stageConfigs } from './data/cdh';
import { platforms, defaultPlatformByPersona } from './data/platforms';
import type { Persona } from './data/types';
import type { Platform } from './data/platforms';
import CandidateProfile from './components/CandidateProfile';
import CDHApiPanel from './components/CDHApiPanel';
import SimpleMobile from './components/SimpleMobile';
import WebPortal from './components/WebPortal';
import MarketerView from './components/MarketerView';
import PersonaBuilder from './components/PersonaBuilder';
import { useTheme, useThemeColors, THEMES } from './context/ThemeContext';
import { useCapture } from './hooks/useCapture';
import { useCDHConfig } from './hooks/useCDHConfig';
import { useCDHLiveCall } from './hooks/useCDHLiveCall';
import { useCDHCaptureResponse } from './hooks/useCDHCaptureResponse';

function SvcIcon({ svc, size = 14 }: { svc: string; size?: number }) {
  if (svc === 'army') return <Sword size={size} />;
  if (svc === 'navy') return <Anchor size={size} />;
  return <Plane size={size} />;
}

function PlatformIcon({ id, size = 12 }: { id: string; size?: number }) {
  if (id === 'tiktok')    return <Music size={size} />;
  if (id === 'facebook')  return <Globe size={size} />;
  if (id === 'instagram') return <Camera size={size} />;
  if (id === 'linkedin')  return <Briefcase size={size} />;
  if (id === 'youtube')   return <PlayCircle size={size} />;
  if (id === 'snapchat')  return <Ghost size={size} />;
  if (id === 'whatsapp')  return <MessageCircle size={size} />;
  return <Globe size={size} />;
}

type ViewMode   = 'mobile' | 'web';
type UserView   = 'candidate' | 'marketer';

// Maps each service to the stageConfigs key that has its journey defined
const SERVICE_STAGE_KEY: Record<string, string> = {
  army: 'james',
  navy: 'sarah',
  raf: 'george',
};

const PHASE_GROUPS = [
  { phaseNum: 1, label: 'Phase 1', sub: 'Attract & Engage',   stages: [1, 2] },
  { phaseNum: 2, label: 'Phase 2', sub: 'Apply & Medical Q',  stages: [3, 4, 5] },
  { phaseNum: 3, label: 'Phase 3', sub: 'Medical & Vetting',  stages: [6, 7] },
  { phaseNum: 4, label: 'Phase 4', sub: 'Selection & AC',     stages: [8, 9, 10, 11] },
  { phaseNum: 5, label: 'Phase 5', sub: 'Offer & Training',   stages: [12, 13] },
];

const STORAGE_KEY = 'arfs-custom-personas';

function loadSavedPersonas(): Persona[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export default function App() {
  // ── Navigation state ───────────────────────────────────────────────────────
  const [selectedPersona, setSelectedPersona] = useState<Persona>(personas[0]);
  const [selectedPhase, setSelectedPhase] = useState(1);
  const [selectedStage, setSelectedStage] = useState(1);
  const [nbaReady, setNBAReady] = useState(false);
  const [apiKey, setApiKey] = useState(0);
  const [activePlatform, setActivePlatform] = useState<Platform>(
    platforms.find((p) => p.id === defaultPlatformByPersona['james'])!
  );

  // ── UI toggle state ────────────────────────────────────────────────────────
  const [viewMode, setViewMode]       = useState<ViewMode>('mobile');
  const [userView, setUserView]       = useState<UserView>('candidate');
  const [showCDHPanel, setShowCDHPanel] = useState(false);

  // ── Theme (from context — set by ThemeProvider in main.tsx) ───────────────
  const { theme, themeId, setThemeId } = useTheme();
  const { tx, tm, ts } = useThemeColors();

  // ── Persona management ─────────────────────────────────────────────────────
  const [savedPersonas, setSavedPersonas] = useState<Persona[]>(loadSavedPersonas);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editPersona, setEditPersona] = useState<Persona | null>(null);

  // ── Stage resolution ───────────────────────────────────────────────────────
  const stageKey = SERVICE_STAGE_KEY[selectedPersona.service] ?? selectedPersona.id;
  const stages = stageConfigs[stageKey] ?? stageConfigs['james'];
  const stage = stages.find((s) => s.id === selectedStage) ?? stages[0];

  // ── CDH live configuration + API call ──────────────────────────────────────
  const { config: cdhConfig, updateConfig: updateCDHConfig, resetConfig: resetCDHConfig } = useCDHConfig();
  const cdhLive = useCDHLiveCall(cdhConfig, stage, selectedPersona, activePlatform);

  /**
   * effectiveStage: identical to `stage` except:
   *   • On Stage 1, pageURL is overridden with the active social platform URL.
   *   • When CDH live mode is on and a real response arrived, actions[] are
   *     replaced with the live NBA actions so every downstream view renders
   *     CDH-live content rather than the built-in stageConfigs mock data.
   *
   * useMemo keeps identity stable — children keyed on effectiveStage won't
   * re-mount on unrelated re-renders.
   */
  const effectiveStage = useMemo(() => {
    const base = selectedStage === 1 ? { ...stage, pageURL: activePlatform.url } : stage;
    if (cdhConfig.enabled && cdhLive.liveActions && cdhLive.liveActions.length > 0) {
      return { ...base, actions: cdhLive.liveActions };
    }
    return base;
  }, [stage, selectedStage, activePlatform.url, cdhConfig.enabled, cdhLive.liveActions]);

  // ── Advance callback (called by useCapture after CTA → done) ─────────────
  const handleAdvance = useCallback((nextStageId: number) => {
    const nextGroup = PHASE_GROUPS.find((g) => g.stages.includes(nextStageId))!;
    setSelectedPhase(nextGroup.phaseNum);
    setSelectedStage(nextStageId);
    setNBAReady(false);
    setApiKey((k) => k + 1);
  }, []);

  // ── Capture state machine ─────────────────────────────────────────────────
  const {
    capturing,
    captured,
    captureRequest,
    captureResponse,
    handleCtaClick: baseHandleCtaClick,
    resetCapture,
  } = useCapture({
    stage,
    effectivePageURL: effectiveStage.pageURL,
    persona: selectedPersona,
    platform: activePlatform,
    nbaReady,
    onAdvance: handleAdvance,
  });

  // ── CDH live capture_response ─────────────────────────────────────────────
  const { fireCaptureResponse } = useCDHCaptureResponse(cdhConfig, cdhLive.rawResponse);

  // When CDH live is on, fire the real capture_response API alongside the mock capture
  const handleCtaClick = useCallback(() => {
    baseHandleCtaClick();
    if (cdhConfig.enabled && cdhLive.rawResponse) {
      void fireCaptureResponse();
    }
  }, [baseHandleCtaClick, cdhConfig.enabled, cdhLive.rawResponse, fireCaptureResponse]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const platformForPersona = (p: Persona) =>
    platforms.find((pl) => pl.id === defaultPlatformByPersona[p.id])
    ?? platforms.find((pl) => pl.id === defaultPlatformByPersona[
      p.service === 'army' ? 'james' : p.service === 'navy' ? 'sarah' : 'george'
    ])
    ?? platforms[0];

  const handlePersonaChange = (p: Persona) => {
    setSelectedPersona(p);
    setSelectedPhase(1);
    setSelectedStage(1);
    setNBAReady(false);
    setApiKey((k) => k + 1);
    setActivePlatform(platformForPersona(p));
    // capture resets automatically via useCapture's internal useEffect on persona.id change
  };

  const handlePersonaSaved = (persona: Persona) => {
    setSavedPersonas((prev) => {
      const exists = prev.some((p) => p.id === persona.id);
      const next = exists
        ? prev.map((p) => (p.id === persona.id ? persona : p))
        : [...prev, persona];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    handlePersonaChange(persona);
  };

  const handleEditPersona = (p: Persona) => { setEditPersona(p); setBuilderOpen(true); };

  const handleDeletePersona = (id: string) => {
    setSavedPersonas((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    if (selectedPersona.id === id) handlePersonaChange(personas[0]);
  };

  const openNewBuilder = () => { setEditPersona(null); setBuilderOpen(true); };

  const handlePhaseChange = (phaseNum: number) => {
    const group = PHASE_GROUPS.find((g) => g.phaseNum === phaseNum)!;
    setSelectedPhase(phaseNum);
    setSelectedStage(group.stages[0]);
    setNBAReady(false);
    setApiKey((k) => k + 1);
    // capture resets automatically via useCapture's internal useEffect on stage.id change
  };

  const handleStageChange = (id: number) => {
    const group = PHASE_GROUPS.find((g) => g.stages.includes(id))!;
    setSelectedPhase(group.phaseNum);
    setSelectedStage(id);
    setNBAReady(false);
    setApiKey((k) => k + 1);
  };

  const handlePlatformChange = (p: Platform) => {
    setActivePlatform(p);
    resetCapture(); // platform switch resets any in-progress capture
  };

  // Drive nbaReady independently so it fires even when CDH API panel is hidden
  const handleNBAReady = useCallback(() => setNBAReady(true), []);
  useEffect(() => {
    setNBAReady(false);
    const latency = 900 + Math.floor(Math.random() * 600);
    const t = setTimeout(() => setNBAReady(true), latency);
    return () => clearTimeout(t);
  }, [apiKey]);

  // ── Sidebar collapse state ────────────────────────────────────────────────
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex" style={{ background: theme.bg, color: tx }}>

      {/* ── Vertical Sidebar ── */}
      <aside
        className="flex-shrink-0 flex flex-col sticky top-0 h-screen overflow-y-auto z-50 transition-all duration-200"
        style={{
          width: sidebarCollapsed ? 52 : 220,
          background: theme.headerBg,
          borderRight: `1px solid ${theme.border}`,
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Logo + collapse toggle */}
        <div
          className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="font-black text-[11px] leading-tight truncate" style={{ color: tx }}>AFRS Studio</div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed((v) => !v)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded transition-all hover:opacity-70"
            style={{ color: ts }}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* ── PERSONAS ── */}
        {!sidebarCollapsed && (
          <div className="px-4 pt-4 pb-1">
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: ts }}>Personas</span>
          </div>
        )}

        <div className="flex flex-col">
          {(['army', 'navy', 'raf'] as const).map((svc) => {
            const presetList = personas.filter((p) => p.service === svc);
            const customList = savedPersonas.filter((p) => p.service === svc);
            if (presetList.length === 0 && customList.length === 0) return null;
            return (
              <div key={svc}>
                {presetList.map((p) => {
                  const active = selectedPersona.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePersonaChange(p)}
                      title={`${p.name} · ${p.role}`}
                      className="w-full flex items-center gap-2 text-left text-[12px] transition-opacity duration-100 hover:opacity-100"
                      style={{
                        padding: sidebarCollapsed ? '6px 0' : '5px 16px',
                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                        color: active ? selectedPersona.color : tm,
                        fontWeight: active ? 700 : 400,
                        opacity: active ? 1 : 0.75,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <SvcIcon svc={svc} size={14} />
                      {!sidebarCollapsed && <span className="truncate">{p.name}</span>}
                    </button>
                  );
                })}
                {customList.map((p) => {
                  const active = selectedPersona.id === p.id;
                  return (
                    <div key={p.id} className="flex items-center">
                      <button
                        onClick={() => handlePersonaChange(p)}
                        title={`${p.name} · ${p.role} · Custom`}
                        className="flex-1 flex items-center gap-2 text-left text-[12px] transition-opacity duration-100 hover:opacity-100 min-w-0"
                        style={{
                          padding: sidebarCollapsed ? '6px 0' : '5px 16px',
                          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                          color: active ? selectedPersona.color : tm,
                          fontWeight: active ? 700 : 400,
                          opacity: active ? 1 : 0.75,
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <SvcIcon svc={svc} size={14} />
                        {!sidebarCollapsed && (
                          <>
                            <span className="truncate">{p.name}</span>
                            <span className="text-[8px] opacity-50 ml-0.5 flex-shrink-0">✦</span>
                          </>
                        )}
                      </button>
                      {!sidebarCollapsed && (
                        <>
                          <button onClick={() => handleEditPersona(p)} title="Edit" className="flex items-center px-1 hover:opacity-100 transition-opacity" style={{ color: tm, opacity: 0.5, background: 'none', border: 'none', cursor: 'pointer' }}><Pencil size={10} /></button>
                          <button onClick={() => handleDeletePersona(p.id)} title="Delete" className="flex items-center px-1 pr-3 hover:opacity-100 transition-opacity" style={{ color: '#ef4444', opacity: 0.6, background: 'none', border: 'none', cursor: 'pointer' }}><XIcon size={10} /></button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          <button
            onClick={openNewBuilder}
            title="Build custom persona"
            className="w-full flex items-center gap-2 text-left text-[12px] transition-opacity duration-100 hover:opacity-100"
            style={{
              padding: sidebarCollapsed ? '6px 0' : '5px 16px',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              color: '#818cf8',
              fontWeight: 500,
              opacity: 0.8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Plus size={12} className="flex-shrink-0" />
            {!sidebarCollapsed && 'Build persona'}
          </button>
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${theme.border}`, margin: '8px 16px' }} />

        {/* ── VIEW ── */}
        {!sidebarCollapsed && (
          <div className="px-4 pb-1">
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: ts }}>View</span>
          </div>
        )}
        <div className="flex flex-col">
          {([['candidate', 'Candidate'], ['marketer', 'Marketer']] as [UserView, string][]).map(([uv, label]) => (
            <button
              key={uv}
              onClick={() => setUserView(uv)}
              title={label}
              className="w-full flex items-center gap-2 text-left text-[12px] transition-opacity duration-100 hover:opacity-100"
              style={{
                padding: sidebarCollapsed ? '6px 0' : '5px 16px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                color: userView === uv ? selectedPersona.color : tm,
                fontWeight: userView === uv ? 700 : 400,
                opacity: userView === uv ? 1 : 0.7,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {uv === 'candidate' ? <Target size={12} className="flex-shrink-0" /> : <BarChart2 size={12} className="flex-shrink-0" />}
              {!sidebarCollapsed && label}
            </button>
          ))}
        </div>

        {/* ── DISPLAY (candidate only) ── */}
        {userView === 'candidate' && (
          <>
            <div style={{ borderTop: `1px solid ${theme.border}`, margin: '8px 16px' }} />
            {!sidebarCollapsed && (
              <div className="px-4 pb-1">
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: ts }}>Display</span>
              </div>
            )}
            <div className="flex flex-col">
              {([['mobile', 'Mobile'], ['web', 'Web']] as [ViewMode, string][]).map(([mode, label]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  title={label}
                  className="w-full flex items-center gap-2 text-left text-[12px] transition-opacity duration-100 hover:opacity-100"
                  style={{
                    padding: sidebarCollapsed ? '6px 0' : '5px 16px',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    color: viewMode === mode ? selectedPersona.color : tm,
                    fontWeight: viewMode === mode ? 700 : 400,
                    opacity: viewMode === mode ? 1 : 0.7,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {mode === 'mobile' ? <Smartphone size={12} className="flex-shrink-0" /> : <Monitor size={12} className="flex-shrink-0" />}
                  {!sidebarCollapsed && label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── SOCIAL CHANNEL (Stage 1 only) ── */}
        {selectedStage === 1 && (
          <>
            <div style={{ borderTop: `1px solid ${theme.border}`, margin: '8px 16px' }} />
            {!sidebarCollapsed && (
              <div className="px-4 pb-1">
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: ts }}>Social Channel</span>
              </div>
            )}
            <div className="flex flex-col">
              {platforms.map((p) => {
                const active = activePlatform.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handlePlatformChange(p)}
                    title={p.label}
                    className="w-full flex items-center gap-2 text-left text-[12px] transition-opacity duration-100 hover:opacity-100"
                    style={{
                      padding: sidebarCollapsed ? '6px 0' : '5px 16px',
                      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                      color: active ? p.color : tm,
                      fontWeight: active ? 700 : 400,
                      opacity: active ? 1 : 0.7,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <span className="flex-shrink-0" style={{ color: active ? p.color : 'inherit' }}>
                      <PlatformIcon id={p.id} size={12} />
                    </span>
                    {!sidebarCollapsed && p.label}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${theme.border}`, margin: '8px 16px' }} />

        {/* ── TOOLS ── */}
        {!sidebarCollapsed && (
          <div className="px-4 pb-1">
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: ts }}>Tools</span>
          </div>
        )}
        <div className="flex flex-col">
          <button
            onClick={() => setShowCDHPanel((v) => !v)}
            title="CDH API Panel"
            className="w-full flex items-center gap-2 text-left text-[12px] transition-opacity duration-100 hover:opacity-100"
            style={{
              padding: sidebarCollapsed ? '6px 0' : '5px 16px',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              color: showCDHPanel ? selectedPersona.color : tm,
              fontWeight: showCDHPanel ? 700 : 400,
              opacity: showCDHPanel ? 1 : 0.7,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Zap size={12} className="flex-shrink-0" />
            {!sidebarCollapsed && 'CDH API'}
          </button>
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${theme.border}`, margin: '8px 16px' }} />

        {/* ── THEME ── */}
        {!sidebarCollapsed && (
          <div className="px-4 pb-2">
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: ts }}>Theme</span>
          </div>
        )}
        <div className={`px-4 pb-3 flex ${sidebarCollapsed ? 'flex-col items-center' : 'flex-row flex-wrap'} gap-2`}>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setThemeId(t.id)}
              title={t.name}
              className="flex-shrink-0 transition-all duration-150"
              style={{
                width: 12, height: 12, borderRadius: '50%',
                background: t.swatch,
                border: themeId === t.id ? `2px solid ${selectedPersona.color}` : `2px solid transparent`,
                outline: themeId === t.id ? `1px solid ${selectedPersona.color}` : 'none',
                transform: themeId === t.id ? 'scale(1.3)' : 'scale(1)',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* CDH live status — pinned to bottom */}
        {cdhConfig.enabled && (
          <div className="mt-auto flex-shrink-0 px-4 py-3" style={{ borderTop: `1px solid ${theme.border}` }}>
            <div
              className={`flex items-center gap-2 text-[11px] ${sidebarCollapsed ? 'justify-center' : ''}`}
              style={{ color: tm, opacity: 0.8 }}
              title={cdhLive.error ? 'CDH Error' : 'CDH Live'}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: cdhLive.liveActions ? '#22c55e' : cdhLive.error ? '#ef4444' : '#f59e0b' }}
              />
              {!sidebarCollapsed && (
                <span className="flex items-center gap-1">{cdhLive.error ? 'CDH Error' : <><span>CDH Live</span><Zap size={10} /></>}</span>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* ── Main column (stage nav + content) ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Stage navigation (phase selector + stage tabs + social strip) ── */}
        <div className="sticky top-0 z-40" style={{ borderBottom: `1px solid ${theme.border}`, background: `${theme.bg}ee`, backdropFilter: 'blur(12px)' }}>
          {/* Phase stepper */}
          <div className="px-6 pt-4 pb-1 flex items-start">
            {PHASE_GROUPS.map((pg, idx) => {
              const active  = selectedPhase === pg.phaseNum;
              const isFirst = idx === 0;
              const isLast  = idx === PHASE_GROUPS.length - 1;
              const isLive  = pg.phaseNum === 1;
              return (
                <button
                  key={pg.phaseNum}
                  onClick={() => handlePhaseChange(pg.phaseNum)}
                  className="flex-1 flex flex-col items-center text-center group transition-opacity duration-150"
                  style={{ opacity: active ? 1 : 0.55 }}
                >
                  {/* Circle + connector lines */}
                  <div className="w-full flex items-center">
                    <div className="flex-1 h-px" style={{ background: isFirst ? 'transparent' : theme.border }} />
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[13px] font-black transition-all duration-150"
                      style={{
                        background: active ? selectedPersona.color : theme.bgAlt,
                        color: active ? 'white' : ts,
                        border: `2px solid ${active ? selectedPersona.color : theme.border}`,
                        boxShadow: active ? `0 0 0 4px ${selectedPersona.color}20` : 'none',
                      }}
                    >
                      {pg.phaseNum}
                    </div>
                    <div className="flex-1 h-px" style={{ background: isLast ? 'transparent' : theme.border }} />
                  </div>

                  {/* Labels */}
                  <div className="mt-2 flex flex-col items-center gap-0.5">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: active ? selectedPersona.color : ts }}>
                        {pg.label}
                      </span>
                      {isLive && active && (
                        <span className="inline-flex items-center gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-[8px] font-bold" style={{ color: '#22c55e' }}>LIVE</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[8px] leading-tight" style={{ color: ts }}>{pg.sub}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stage row */}
          <div className="px-5 flex items-center">
            {(PHASE_GROUPS.find((g) => g.phaseNum === selectedPhase)?.stages ?? []).map((sid) => {
              const stageData = stages.find((s) => s.id === sid);
              if (!stageData) return null;
              const active = selectedStage === sid;
              return (
                <button
                  key={sid}
                  onClick={() => handleStageChange(sid)}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-all duration-150"
                  style={{ borderColor: active ? selectedPersona.color : 'transparent', color: active ? tx : tm, background: active ? `${selectedPersona.color}08` : 'transparent' }}
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0"
                    style={{ background: active ? selectedPersona.color : theme.bgAlt, color: active ? 'white' : tm, border: `1px solid ${theme.border}` }}
                  >
                    {sid}
                  </span>
                  <span className="hidden sm:inline">{stageData.shortName}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* ── Main content ── */}
        <div className="flex-1 px-5 py-5" style={{ color: tx }}>
          <div
            className="grid gap-5 items-start"
            style={{ gridTemplateColumns: '1fr 280px' }}
          >

            {/* Centre: Candidate view or Marketer view */}
            <div className="flex flex-col gap-4">
              {userView === 'marketer' ? (
                <MarketerView
                  key={`marketer-${selectedPersona.id}-${stage.id}-${activePlatform.id}`}
                  stage={effectiveStage}
                  persona={selectedPersona}
                  platform={activePlatform}
                  nbaReady={nbaReady}
                />
              ) : (
                <>
                  <div className="flex justify-center">
                    {viewMode === 'mobile' && (
                      <SimpleMobile
                        key={`mobile-${selectedPersona.id}-${stage.id}-${activePlatform.id}`}
                        stage={effectiveStage}
                        persona={selectedPersona}
                        nbaReady={nbaReady}
                        platform={activePlatform}
                        capturing={capturing}
                        captured={captured}
                        onCtaClick={handleCtaClick}
                        isLive={cdhConfig.enabled}
                      />
                    )}
                    {viewMode === 'web' && (
                      <div className="w-full">
                        <WebPortal
                          key={`web-${selectedPersona.id}-${stage.id}-${activePlatform.id}`}
                          stage={effectiveStage}
                          persona={selectedPersona}
                          nbaReady={nbaReady}
                          platform={activePlatform}
                          capturing={capturing}
                          captured={captured}
                          onCtaClick={handleCtaClick}
                          isLive={cdhConfig.enabled}
                        />
                      </div>
                    )}
                  </div>

                  {/* Candidate sees strip */}
                  <div
                    className="w-full rounded-xl p-3 text-xs text-slate-300 leading-relaxed"
                    style={{ background: `${selectedPersona.color}0a`, border: `1px solid ${selectedPersona.color}20` }}
                  >
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: selectedPersona.color }}>
                      Candidate sees · {stage.dayRange}
                    </div>
                    {stage.candidateSees}
                  </div>
                </>
              )}
            </div>

            {/* Right column: Candidate Profile + CDH API panel */}
            <div className="flex flex-col gap-4">

              {/* Candidate profile + signals */}
              <div>
                <div className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: ts }}>
                  Candidate Profile · Signal Feed
                </div>
                <CandidateProfile
                  key={`profile-${selectedPersona.id}-${stage.id}`}
                  stage={effectiveStage}
                  persona={selectedPersona}
                  showSignalFeed={showCDHPanel}
                />
              </div>

              {/* CDH API panel — shown below profile when toggled */}
              {showCDHPanel && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2" style={{ color: ts }}>
                    CDH Real-Time Container · API
                    {cdhConfig.enabled && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: cdhLive.liveActions ? '#22c55e20' : '#f59e0b20', color: cdhLive.liveActions ? '#22c55e' : '#f59e0b', border: `1px solid ${cdhLive.liveActions ? '#22c55e40' : '#f59e0b40'}` }}>
                        <span className={`w-1 h-1 rounded-full ${cdhLive.liveActions ? 'bg-green-400' : 'bg-amber-400'} animate-pulse`} />
                        {cdhLive.loading ? 'CALLING…' : cdhLive.liveActions ? 'LIVE' : cdhLive.error ? 'ERROR' : 'LIVE'}
                      </span>
                    )}
                  </div>
                  <CDHApiPanel
                    key={`api-${apiKey}`}
                    stage={effectiveStage}
                    persona={selectedPersona}
                    onNBAReady={handleNBAReady}
                    captureRequest={captureRequest}
                    captureResponse={captureResponse}
                    config={cdhConfig}
                    onConfigChange={updateCDHConfig}
                    onConfigReset={resetCDHConfig}
                    liveState={cdhLive}
                    onManualCall={cdhLive.callCDH}
                    buildRequestBody={cdhLive.buildRequestBody}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Persona Builder modal */}
      <PersonaBuilder
        isOpen={builderOpen}
        onClose={() => { setBuilderOpen(false); setEditPersona(null); }}
        onApply={handlePersonaSaved}
        editPersona={editPersona}
      />
    </div>
  );
}

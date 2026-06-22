/**
 * ThemeContext — makes the active theme available to any component in the tree
 * without prop-drilling through intermediate layout components.
 *
 * Usage:
 *   // Reading the theme
 *   const { theme, themeId, setThemeId } = useTheme();
 *
 *   // Computed colour shortcuts (safe for both light/dark themes)
 *   const { tx, tm, ts } = useThemeColors();
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface ThemeConfig {
  id: string;
  name: string;
  swatch: string;
  bg: string;
  bgAlt: string;
  headerBg: string;
  border: string;
  /** True only for the Light theme; controls text/muted colour palette */
  light?: boolean;
  textColor?: string;
  mutedColor?: string;
}

export const THEMES: readonly ThemeConfig[] = [
  { id: 'midnight', name: 'Midnight', swatch: '#1e293b',
    bg: '#080c18', bgAlt: '#0d1424', headerBg: 'rgba(8,12,24,0.97)', border: '#1e293b' },
  { id: 'carbon',   name: 'Carbon',   swatch: '#222',
    bg: '#090909', bgAlt: '#131313', headerBg: 'rgba(9,9,9,0.97)',   border: '#242424' },
  { id: 'navy',     name: 'MOD Navy', swatch: '#0a1e3d',
    bg: '#04101e', bgAlt: '#081828', headerBg: 'rgba(4,16,30,0.97)', border: '#1a3050' },
  { id: 'forest',   name: 'Forest',   swatch: '#122018',
    bg: '#080f0a', bgAlt: '#0d1a0f', headerBg: 'rgba(8,15,10,0.97)', border: '#1c3020' },
  { id: 'slate',    name: 'Slate',    swatch: '#334155',
    bg: '#0f172a', bgAlt: '#1e293b', headerBg: 'rgba(15,23,42,0.97)', border: '#334155' },
  { id: 'light',    name: 'Light',    swatch: '#e2e8f0',
    bg: '#f1f5f9', bgAlt: '#ffffff', headerBg: 'rgba(255,255,255,0.97)', border: '#e2e8f0',
    textColor: '#0f172a', mutedColor: '#64748b', light: true },
];

export type Theme = ThemeConfig;
export type ThemeId = string;

// Helpers — keep colour resolution in one place so no consumer duplicates the logic
function textColor(t: ThemeConfig)  { return t.light ? (t.textColor  ?? '#0f172a') : 'white'; }
function mutedColor(t: ThemeConfig) { return t.light ? (t.mutedColor ?? '#64748b') : '#475569'; }
function subtleColor(t: ThemeConfig){ return t.light ? '#94a3b8' : '#334155'; }

interface ThemeContextValue {
  theme: Theme;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('light');
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];

  // Write CSS custom properties to :root so raw CSS and Tailwind
  // arbitrary values can consume them without reading from JS state.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeId);
    root.style.setProperty('--color-bg',        theme.bg);
    root.style.setProperty('--color-bg-alt',    theme.bgAlt);
    root.style.setProperty('--color-border',    theme.border);
    root.style.setProperty('--color-header-bg', theme.headerBg);
    root.style.setProperty('--color-text',      textColor(theme));
    root.style.setProperty('--color-muted',     mutedColor(theme));
    root.style.setProperty('--color-subtle',    subtleColor(theme));
  }, [theme, themeId]);

  return (
    <ThemeContext.Provider value={{ theme, themeId, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Full theme object + setter */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

/** Computed text colour shortcuts — safe for light + dark */
export function useThemeColors() {
  const { theme } = useTheme();
  return {
    tx: textColor(theme),
    tm: mutedColor(theme),
    ts: subtleColor(theme),
  };
}

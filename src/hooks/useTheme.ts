import { useCallback, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'tricode-theme';
const listeners = new Set<() => void>();

function readInitial(): Theme {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
  }
  return 'dark';
}

let current: Theme = readInitial();

function apply(theme: Theme) {
  current = theme;
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f8f6f1' : '#05060b');
  }
  listeners.forEach((listener) => listener());
}

export function setTheme(theme: Theme) {
  apply(theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* localStorage no disponible (modo privado): el tema igual aplica en runtime. */
  }
}

export function toggleTheme() {
  setTheme(current === 'dark' ? 'light' : 'dark');
}

// --- Transición animada de tema (pub/sub) ---
// El toggle no cambia el tema al instante: emite un "request" con el destino y
// el punto de origen (el botón). El overlay <ThemeTransition/> reproduce la
// animación y llama a setTheme() a mitad (cuando la pantalla está cubierta).
// Si no hay overlay montado, cae a un cambio inmediato.
export type ThemeToggleRequest = { target: Theme; x: number; y: number };
const toggleRequestListeners = new Set<(request: ThemeToggleRequest) => void>();

export function onThemeToggleRequest(callback: (request: ThemeToggleRequest) => void) {
  toggleRequestListeners.add(callback);
  return () => {
    toggleRequestListeners.delete(callback);
  };
}

export function requestThemeToggle(origin?: { x: number; y: number }) {
  const target: Theme = current === 'dark' ? 'light' : 'dark';
  if (toggleRequestListeners.size === 0) {
    setTheme(target);
    return;
  }
  const x = origin?.x ?? (typeof window !== 'undefined' ? window.innerWidth - 56 : 0);
  const y = origin?.y ?? 44;
  toggleRequestListeners.forEach((callback) => callback({ target, x, y }));
}

// Si el usuario no eligió explícitamente, seguimos el tema del sistema.
if (typeof window !== 'undefined' && window.matchMedia) {
  const media = window.matchMedia('(prefers-color-scheme: light)');
  media.addEventListener('change', (event) => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored === 'light' || stored === 'dark') return;
    apply(event.matches ? 'light' : 'dark');
  });
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): Theme {
  return current;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => 'dark' as Theme);
  const toggle = useCallback(() => toggleTheme(), []);
  return { theme, toggleTheme: toggle };
}

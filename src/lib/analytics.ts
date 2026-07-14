// Google Analytics 4 -- deshabilitado por defecto. Se activa solo si existe
// VITE_GA_MEASUREMENT_ID (ver .env.example); sin esa env var estas funciones
// no hacen nada y no se manda ningún dato a Google. Para activar: crear una
// property GA4, pegar el Measurement ID (formato G-XXXXXXX) en .env, listo --
// no hace falta tocar código.
const MEASUREMENT_ID =
  typeof import.meta.env.VITE_GA_MEASUREMENT_ID === 'string'
    ? import.meta.env.VITE_GA_MEASUREMENT_ID.trim()
    : '';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

export function initAnalytics() {
  if (!MEASUREMENT_ID || initialized || typeof document === 'undefined') return;
  initialized = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  // send_page_view desactivado: esta es una SPA con router propio, el
  // pageview inicial y los de navegación se mandan a mano via trackPageview().
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false });
}

export function trackPageview(path: string) {
  if (!MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'page_view', { page_path: path });
}

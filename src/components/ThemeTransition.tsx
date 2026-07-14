import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { onThemeToggleRequest, setTheme, type ThemeToggleRequest } from '../hooks/useTheme';
import { EASE_OUT_EXPO } from '../lib/motion';

// Reveal rápido: círculo que crece desde el botón + un guiño de sol/luna en el
// origen. El tema se cambia cuando ya está cubierto (SWAP_MS) y el overlay se
// desvanece enseguida (REVEAL_MS). Total ~0.7s.
const SWAP_MS = 300;
const REVEAL_MS = 440;

const NIGHT_SKY =
  'radial-gradient(135% 120% at var(--tt-x) var(--tt-y), #271c58 0%, #120f33 42%, #070817 100%)';
const DAY_SKY =
  'radial-gradient(135% 120% at var(--tt-x) var(--tt-y), #fff4e0 0%, #f4ecdd 46%, #efe7ee 100%)';

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function MiniMoon() {
  return (
    <div className="relative h-12 w-12">
      <div className="absolute inset-[-55%] rounded-full bg-[radial-gradient(circle,rgba(196,184,255,0.6),transparent_62%)] blur-xl" />
      <div className="absolute inset-0 overflow-hidden rounded-full bg-[radial-gradient(circle_at_34%_28%,#fdfbff,#ded6f6_62%,#c9bff0)] shadow-[inset_-6px_-4px_12px_rgba(84,66,140,0.4)]">
        <span className="absolute left-[55%] top-[28%] h-2 w-2 rounded-full bg-[#c7bced]" />
        <span className="absolute left-[28%] top-[56%] h-2.5 w-2.5 rounded-full bg-[#c7bced]" />
      </div>
    </div>
  );
}

function MiniSun() {
  return (
    <div className="relative h-12 w-12">
      <div className="absolute inset-[-65%] rounded-full bg-[radial-gradient(circle,rgba(255,196,120,0.6),transparent_60%)] blur-xl" />
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-[-38%] animate-spin-slow text-[#ffb154]"
        fill="none"
        aria-hidden
      >
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x1 = 50 + Math.cos(angle) * 40;
          const y1 = 50 + Math.sin(angle) * 40;
          const x2 = 50 + Math.cos(angle) * 49;
          const y2 = 50 + Math.sin(angle) * 49;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          );
        })}
      </svg>
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_42%,#fff8ec,#ffd28a_52%,#ffb154)] shadow-[0_0_22px_rgba(255,178,84,0.6)]" />
    </div>
  );
}

export default function ThemeTransition() {
  const [req, setReq] = useState<ThemeToggleRequest | null>(null);

  useEffect(
    () =>
      onThemeToggleRequest((request) => {
        // A pantalla completa es el tipo de movimiento que conviene evitar con
        // reduced-motion: ahí cambiamos el tema al instante, sin animación.
        if (prefersReducedMotion()) {
          setTheme(request.target);
          return;
        }
        setReq(request);
      }),
    [],
  );

  useEffect(() => {
    if (!req) return undefined;
    const swap = window.setTimeout(() => setTheme(req.target), SWAP_MS);
    const reveal = window.setTimeout(() => setReq(null), REVEAL_MS);
    return () => {
      window.clearTimeout(swap);
      window.clearTimeout(reveal);
    };
  }, [req]);

  const toDark = req?.target === 'dark';
  const sky = toDark ? NIGHT_SKY : DAY_SKY;

  const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const height = typeof window !== 'undefined' ? window.innerHeight : 800;
  const radius = req
    ? Math.hypot(Math.max(req.x, width - req.x), Math.max(req.y, height - req.y)) * 1.08
    : 0;

  return (
    <AnimatePresence>
      {req ? (
        <motion.div
          key="theme-transition"
          className="fixed inset-0 z-[9999]"
          style={{ pointerEvents: 'auto' }}
          aria-hidden
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: sky,
              // El gradiente se centra en el botón (mismo origen que el círculo).
              ['--tt-x' as string]: `${req.x}px`,
              ['--tt-y' as string]: `${req.y}px`,
            }}
            initial={{ clipPath: `circle(0px at ${req.x}px ${req.y}px)` }}
            animate={{ clipPath: `circle(${radius}px at ${req.x}px ${req.y}px)` }}
            transition={{ duration: 0.42, ease: EASE_OUT_EXPO }}
          />

          <motion.div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: req.x, top: req.y }}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.34, ease: EASE_OUT_EXPO }}
          >
            {toDark ? <MiniMoon /> : <MiniSun />}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

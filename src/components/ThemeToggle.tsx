import { AnimatePresence, motion } from 'framer-motion';
import type { MouseEvent } from 'react';
import { requestThemeToggle, useTheme } from '../hooks/useTheme';
import { EASE_OUT_EXPO } from '../lib/motion';

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const onToggle = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    requestThemeToggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.88 }}
      transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={isDark ? 'Tema claro' : 'Tema oscuro'}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/70 transition-colors hover:text-white hover:border-white/30 hover:bg-white/[0.05] ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
          className="inline-flex"
        >
          {isDark ? <MoonIcon /> : <SunIcon />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

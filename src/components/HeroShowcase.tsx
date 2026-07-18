import { useRef, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Vitrina de producto: un stack 3D de UIs reales (panel CMS, calendario de
 * reservas y una card de crecimiento) que flotan y se inclinan siguiendo el
 * cursor. Todo con tokens themeados (surface-card / white / brand) para que
 * funcione en claro y oscuro.
 */

const CARD_SHADOW = 'shadow-card-float';

function ChromeDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full bg-white/15" />
      <span className="h-2 w-2 rounded-full bg-white/15" />
      <span className="h-2 w-2 rounded-full bg-white/15" />
    </div>
  );
}

function CmsCard() {
  const bars = [38, 60, 30, 72, 52, 84, 66];
  return (
    <div className={`surface-card w-[300px] overflow-hidden rounded-2xl border border-white/10 ${CARD_SHADOW} backdrop-blur-xl`}>
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-3.5 py-2.5">
        <ChromeDots />
        <div className="flex-1 truncate rounded-md border border-white/[0.06] bg-black/20 px-2.5 py-1 font-mono text-[9px] text-white/45">
          panel.tricode.studio
        </div>
        <span className="font-mono text-[9px] text-white/30">⌘K</span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-lavender/85">
            Panel · CMS
          </span>
          <span className="flex items-center gap-1 font-mono text-[9px] text-emerald-400/90">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            en vivo
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
            <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/45">Cambios</div>
            <div className="display-md mt-1 text-xl leading-none text-white">128</div>
            <div className="mt-1 font-mono text-[8px] text-emerald-400/90">↑ 12%</div>
          </div>
          <div className="col-span-2 flex items-end gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
            {bars.map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-brand-purple/70 to-brand-lavender/60"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        <div className="mt-2 rounded-lg border border-white/[0.06] bg-white/[0.015] p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/70">Editando · Caso destacado</span>
            <span className="flex items-center gap-1 font-mono text-[8px] text-emerald-400/85">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              auto-guardado
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-white/[0.07]" />
          <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-white/[0.04]" />
        </div>
      </div>
    </div>
  );
}

function BookingCard() {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const busy = [2, 6, 11, 16];
  return (
    <div className={`surface-card w-[206px] rounded-2xl border border-white/10 ${CARD_SHADOW} backdrop-blur-xl p-3.5`}>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-lavender/85">
          Reservas
        </span>
        <span className="flex items-center gap-1 font-mono text-[9px] text-emerald-400/90">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          hoy
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day) => (
          <span key={day} className="font-mono text-[8px] uppercase text-white/35">
            {day}
          </span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: 21 }, (_, i) => i).map((slot) => (
          <span
            key={slot}
            className={`flex aspect-square items-center justify-center rounded-[4px] text-[8px] font-mono ${
              busy.includes(slot)
                ? 'bg-grad-brand text-[#fff] shadow-[0_0_8px_rgba(124,58,237,0.5)]'
                : 'border border-white/[0.06] bg-white/[0.02] text-white/25'
            }`}
          >
            {slot + 8}
          </span>
        ))}
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-white/65">
        <span className="h-1.5 w-1.5 rounded-full bg-grad-brand" />
        Turno · 14:30
        <svg viewBox="0 0 24 24" className="ml-auto h-3.5 w-3.5 text-emerald-400" fill="none" aria-hidden>
          <path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function GrowthCard() {
  return (
    <div className={`surface-card w-[176px] rounded-2xl border border-white/10 ${CARD_SHADOW} backdrop-blur-xl p-3.5`}>
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">Ingresos · 30d</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="display-md text-2xl leading-none text-white">+18%</span>
        <span className="text-xs text-emerald-400">↑</span>
      </div>
      <svg viewBox="0 0 100 40" className="mt-2 h-9 w-full text-brand-purple" fill="none" preserveAspectRatio="none" aria-hidden>
        <path
          d="M2 34 L20 27 L38 30 L56 17 L74 20 L98 5 L98 40 L2 40 Z"
          fill="currentColor"
          opacity="0.12"
        />
        <path
          d="M2 34 L20 27 L38 30 L56 17 L74 20 L98 5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-white/40">vs. mes previo</div>
    </div>
  );
}

export default function HeroShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 110, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 110, damping: 18 });

  const onMove = (event: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative w-full max-w-[460px] scale-[0.82] sm:scale-90 lg:scale-100 [perspective:1500px]"
      aria-hidden
    >
      {/* halo detrás del stack */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-purple/20 blur-[130px]" />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative mx-auto h-[400px] w-[420px] max-w-full"
      >
        <motion.div
          style={{ z: 0, transformStyle: 'preserve-3d' }}
          animate={{ y: [0, -9, 0] }}
          transition={{ repeat: Infinity, duration: 7.5, ease: 'easeInOut' }}
          className="absolute left-2 top-10 -rotate-[4deg]"
        >
          <CmsCard />
        </motion.div>

        <motion.div
          style={{ z: 70, transformStyle: 'preserve-3d' }}
          animate={{ y: [0, -11, 0] }}
          transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut', delay: 0.6 }}
          className="absolute bottom-2 left-0 rotate-[3deg]"
        >
          <BookingCard />
        </motion.div>

        <motion.div
          style={{ z: 48, transformStyle: 'preserve-3d' }}
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 8.5, ease: 'easeInOut', delay: 1.1 }}
          className="absolute right-0 top-0 rotate-[5deg]"
        >
          <GrowthCard />
        </motion.div>
      </motion.div>
    </div>
  );
}

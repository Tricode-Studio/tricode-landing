import { useEffect, useMemo, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Particles from './Particles';
import Marquee from './Marquee';
import MagneticButton from './MagneticButton';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from '../lib/motion';

const TYPE_MS = 90;
const DELETE_MS = 45;
const HOLD_MS = 1500;

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export default function Hero() {
  const { config } = useLandingData();
  const rotating = useMemo(
    () =>
      Array.isArray(config.hero?.rotatingWords)
        ? config.hero.rotatingWords.map((word) => trimmed(word)).filter(Boolean)
        : [],
    [config.hero?.rotatingWords],
  );
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing');
  const titlePrefix = trimmed(config.hero?.titlePrefix);
  const titleSuffix = trimmed(config.hero?.titleSuffix);
  const description = trimmed(config.hero?.description);
  const primaryCtaLabel = trimmed(config.hero?.primaryCtaLabel);
  const secondaryCtaLabel = trimmed(config.hero?.secondaryCtaLabel);
  const primaryCtaHref = trimmed(config.hero?.primaryCtaHref);
  const secondaryCtaHref = trimmed(config.hero?.secondaryCtaHref);
  const statusLabel = trimmed(config.hero?.statusLabel);
  const techStack =
    Array.isArray(config.hero?.techStack)
      ? config.hero.techStack.map((item) => trimmed(item)).filter(Boolean)
      : [];
  const backgroundImage = trimmed(config.hero?.backgroundImage);
  const longestRotating = rotating.reduce(
    (longest, word) => (word.length > longest.length ? word : longest),
    '',
  );

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);

  useEffect(() => {
    if (!rotating.length) {
      setIdx(0);
      setText('');
      setPhase('typing');
      return;
    }
    if (idx >= rotating.length) {
      setIdx(0);
      setText('');
      setPhase('typing');
    }
  }, [idx, rotating]);

  useEffect(() => {
    if (!rotating.length) {
      return undefined;
    }
    const word = rotating[idx] ?? '';
    let timeout = 0;
    if (phase === 'typing') {
      if (text.length < word.length) {
        timeout = window.setTimeout(() => setText(word.slice(0, text.length + 1)), TYPE_MS);
      } else {
        timeout = window.setTimeout(() => setPhase('holding'), 0);
      }
    } else if (phase === 'holding') {
      timeout = window.setTimeout(() => setPhase('deleting'), HOLD_MS);
    } else if (text.length > 0) {
      timeout = window.setTimeout(() => setText(word.slice(0, text.length - 1)), DELETE_MS);
    } else {
      setIdx((current) => (current + 1) % rotating.length);
      setPhase('typing');
    }
    return () => window.clearTimeout(timeout);
  }, [text, phase, idx, rotating]);

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-center pt-28 pb-28 sm:pt-32 sm:pb-32 overflow-hidden"
    >
      {/* Background image with parallax + heavy gradients */}
      {backgroundImage ? (
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 bg-right bg-no-repeat will-change-transform"
        >
          <div
            className="absolute inset-0 bg-no-repeat bg-right opacity-90"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        </motion.div>
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/95 via-ink-950/70 to-ink-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/20" />
      <div className="absolute inset-0 grid-bg-soft opacity-50 [mask-image:radial-gradient(ellipse_at_30%_50%,black_30%,transparent_75%)]" />
      <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-brand-violet/15 blur-[140px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-0 h-[420px] w-[420px] rounded-full bg-brand-indigo/15 blur-[160px]" />
      <Particles count={26} />

      <div className="relative w-full container-wide">
        {/* Eyebrow row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-10 sm:mb-14 font-mono text-[11px] uppercase tracking-[0.3em] text-white/55"
        >
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {statusLabel || 'Estudio · Disponible 2026'}
          </span>
          <span className="text-white/25">/</span>
          <span>Trinidad · Flores · Uruguay</span>
          <span className="text-white/25 hidden sm:inline">/</span>
          <span className="hidden sm:inline">Producto · Diseño · Código</span>
        </motion.div>

        <div className="grid grid-cols-12 gap-x-6 gap-y-12 items-end">
          {/* Display title */}
          <div className="col-span-12 lg:col-span-9">
            <h1 className="display-xl text-[3rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[11rem]">
              <motion.span
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.25 }}
                className="block overflow-hidden"
              >
                <span className="block text-white">{titlePrefix || 'Transformamos'}</span>
              </motion.span>

              {rotating.length ? (
                <motion.span
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.45 }}
                  className="block overflow-hidden"
                >
                  <span className="relative inline-grid align-baseline italic-serif">
                    <span aria-hidden className="invisible whitespace-pre col-start-1 row-start-1">
                      {longestRotating}
                    </span>
                    <span className="text-grad col-start-1 row-start-1 whitespace-pre">
                      {text}
                      <span className="caret" aria-hidden>|</span>
                    </span>
                  </span>
                </motion.span>
              ) : null}

              {titleSuffix ? (
                <motion.span
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.65 }}
                  className="block overflow-hidden"
                >
                  <span className="block text-white">{titleSuffix}</span>
                </motion.span>
              ) : null}
            </h1>
          </div>

          {/* Right column with description and CTAs */}
          <motion.div
            variants={stagger(0.1, 0.9)}
            initial="hidden"
            animate="show"
            className="col-span-12 lg:col-span-3 lg:pl-6 lg:border-l lg:border-white/10 flex flex-col gap-7"
          >
            {description ? (
              <motion.p
                variants={fadeUp}
                className="text-base md:text-lg text-white/65 leading-relaxed font-sans"
              >
                {description}
              </motion.p>
            ) : null}

            {primaryCtaLabel && primaryCtaHref ? (
              <motion.div variants={fadeUp} className="flex flex-col gap-3">
                <MagneticButton
                  href={primaryCtaHref}
                  strength={0.3}
                  className="group btn bg-grad-brand text-white shadow-glow-sm hover:shadow-glow rounded-full px-7 py-4 text-sm font-medium"
                >
                  <span>{primaryCtaLabel}</span>
                  <span
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </MagneticButton>
                {secondaryCtaLabel && secondaryCtaHref ? (
                  <a
                    href={secondaryCtaHref}
                    className="group inline-flex items-center gap-2 text-sm font-mono uppercase tracking-[0.18em] text-white/70 hover:text-white transition-colors"
                  >
                    <span className="link-reveal">{secondaryCtaLabel}</span>
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    >
                      ↗
                    </span>
                  </a>
                ) : null}
              </motion.div>
            ) : null}
          </motion.div>
        </div>

        {/* Tech stack chips */}
        {techStack.length ? (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: EASE_OUT_EXPO }}
            className="mt-12 sm:mt-16 flex flex-wrap items-center gap-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35 mr-3">
              Stack ·
            </span>
            {techStack.map((tech, i) => (
              <motion.span
                key={tech}
                whileHover={{ y: -2, borderColor: 'rgba(139,92,246,0.6)' }}
                transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                viewport={viewportOnce}
                className="rounded-full border border-white/10 bg-ink-900/40 backdrop-blur-md px-3 py-1.5 font-mono text-[10px] text-white/75"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        ) : null}

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="hidden md:flex absolute bottom-12 right-12 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/35"
        >
          <span>Scroll</span>
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="block h-10 w-px bg-gradient-to-b from-white/50 to-transparent"
          />
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20">
        <Marquee />
      </div>
    </section>
  );
}

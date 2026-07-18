import { useEffect, useMemo, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Particles from './Particles';
import Marquee from './Marquee';
import MagneticButton from './MagneticButton';
import HeroShowcase from './HeroShowcase';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, fadeUp, stagger } from '../lib/motion';

const TYPE_MS = 95;
const DELETE_MS = 45;
const HOLD_MS = 1700;

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
  const longestRotating = rotating.reduce(
    (longest, word) => (word.length > longest.length ? word : longest),
    '',
  );

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 140]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const bgScale = useTransform(scrollY, [0, 600], [1, 1.08]);

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
    if (!rotating.length) return undefined;
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
      className="relative flex flex-col justify-end pt-24 pb-24 sm:min-h-[100svh] sm:pt-32 sm:pb-32 md:pb-36 overflow-hidden"
    >
      {/* Layered background (imagen por tema vía --bg-hero) */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity, scale: bgScale }}
        className="absolute inset-0 will-change-transform"
      >
        <div className="sbg-hero absolute inset-0 bg-no-repeat bg-right opacity-30" />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/95 via-ink-950/70 to-ink-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/82 to-ink-950/30" />
      <div className="absolute inset-0 grid-bg-soft opacity-60 [mask-image:radial-gradient(ellipse_at_30%_55%,black_25%,transparent_75%)]" />

      <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-brand-purple/12 blur-[160px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 h-[460px] w-[460px] rounded-full bg-brand-indigo/12 blur-[180px]" />
      <div className="absolute inset-0 noise-overlay" />

      <Particles count={20} />

      <div className="relative w-full container-wide">
        {/* Display block: texto + vitrina de producto */}
        <div className="grid grid-cols-12 gap-x-0 lg:gap-x-10 gap-y-14 lg:items-center">
          <div className="col-span-12 lg:col-span-6">
            <h1 className="font-sans font-semibold tracking-tight leading-[1.05] text-[2.15rem] xs:text-[2.9rem] sm:text-[3.6rem] md:text-[4.2rem] lg:text-[3.8rem] xl:text-[4.5rem]">
              <motion.span
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.2 }}
                className="block text-bone-50"
              >
                {titlePrefix || 'Transformamos'}
              </motion.span>

              {rotating.length ? (
                <motion.span
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.36 }}
                  className="block"
                >
                  <span className="relative inline-grid align-baseline">
                    <span aria-hidden className="invisible whitespace-pre col-start-1 row-start-1">
                      {longestRotating}
                    </span>
                    <span className="col-start-1 row-start-1 whitespace-pre">
                      <span className="kw-mark">{text}</span>
                      <span className="caret" aria-hidden>|</span>
                    </span>
                  </span>
                </motion.span>
              ) : null}

              {titleSuffix ? (
                <motion.span
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.52 }}
                  className="block text-bone-50"
                >
                  {titleSuffix}
                </motion.span>
              ) : null}
            </h1>

            <motion.div
              variants={stagger(0.12, 0.7)}
              initial="hidden"
              animate="show"
              className="mt-8 flex flex-col gap-7 max-w-xl"
            >
              {description ? (
                <motion.p
                  variants={fadeUp}
                  className="text-base md:text-lg text-bone-50/65 leading-relaxed font-sans"
                >
                  {description}
                </motion.p>
              ) : null}

              {primaryCtaLabel && primaryCtaHref ? (
                <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-6 gap-y-4">
                  <MagneticButton
                    href={primaryCtaHref}
                    strength={0.3}
                    className="btn-sheen group inline-flex items-center justify-center gap-2 rounded-full bg-bone-50 text-ink-950 px-7 py-4 text-sm font-medium transition-colors duration-300 hover:bg-brand-mist hover:shadow-glow-sm"
                  >
                    <span>{primaryCtaLabel}</span>
                    <span aria-hidden className="transition-transform group-hover:translate-x-1.5">
                      →
                    </span>
                  </MagneticButton>
                  {secondaryCtaLabel && secondaryCtaHref ? (
                    <a
                      href={secondaryCtaHref}
                      className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.24em] text-bone-50/70 hover:text-bone-50 transition-colors"
                    >
                      <span className="link-reveal">{secondaryCtaLabel}</span>
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
                    </a>
                  ) : null}
                </motion.div>
              ) : null}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.5 }}
            className="col-span-12 lg:col-span-6 flex justify-center lg:justify-end"
          >
            <HeroShowcase />
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20">
        <Marquee />
      </div>
    </section>
  );
}

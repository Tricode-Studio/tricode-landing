import { useEffect, useMemo, useState } from 'react';
import Particles from './Particles';
import Marquee from './Marquee';
import { useLandingData } from '../content/LandingDataContext';

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
      className="relative min-h-[100vh] flex items-center pt-8 pb-28 sm:pt-10 sm:pb-32 md:pt-14 md:pb-36 overflow-hidden"
    >
      {backgroundImage ? (
        <div
          className="absolute inset-x-0 bottom-0 -top-2 sm:top-2 md:top-6 bg-right bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/95 via-ink-950/70 to-ink-950/85 md:bg-gradient-to-r md:from-ink-950 md:via-ink-950/85 md:to-ink-950/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/40" />
      <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <Particles count={22} />

      <div className="relative w-full px-6 sm:px-10 md:px-32 lg:px-48 xl:px-56 2xl:px-64">
        <div className="max-w-2xl mr-auto">
          <h1 className="text-[2.5rem] sm:text-6xl md:text-[4.25rem] lg:text-[5rem] leading-[1.05] font-semibold tracking-tight reveal reveal-delay-1">
            {titlePrefix}
            {rotating.length ? (
              <>
                {titlePrefix ? ' ' : ''}
                <span className="relative inline-grid align-baseline">
                  <span
                    aria-hidden
                    className="invisible italic font-light whitespace-pre col-start-1 row-start-1"
                  >
                    {longestRotating}
                  </span>
                  <span className="text-grad italic font-light col-start-1 row-start-1 whitespace-pre">
                    {text}
                    <span className="caret" aria-hidden>|</span>
                  </span>
                </span>
              </>
            ) : null}
            {titleSuffix ? (
              <>
                <br />
                {titleSuffix}
              </>
            ) : null}
          </h1>

          {description ? (
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-xl reveal reveal-delay-2">
              {description}
            </p>
          ) : null}

          {primaryCtaLabel && primaryCtaHref ? (
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 reveal reveal-delay-3">
              <a href={primaryCtaHref} className="btn-primary group w-full sm:w-auto">
                {primaryCtaLabel}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              {secondaryCtaLabel && secondaryCtaHref ? (
                <a href={secondaryCtaHref} className="btn-ghost backdrop-blur-sm w-full sm:w-auto">
                  {secondaryCtaLabel}
                </a>
              ) : null}
            </div>
          ) : null}

          {statusLabel || techStack.length ? (
            <div className="mt-10 sm:mt-12 flex flex-wrap items-center gap-2 sm:gap-3 reveal reveal-delay-4">
              {statusLabel ? (
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-ink-900/60 backdrop-blur-md px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-[11px] text-white/80">{statusLabel}</span>
                </div>
              ) : null}
              {techStack.length ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/10 bg-ink-900/60 backdrop-blur-md px-2.5 py-1 font-mono text-[10px] text-white/80 hover:border-brand-purple/50 hover:text-white transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20">
        <Marquee />
      </div>
    </section>
  );
}

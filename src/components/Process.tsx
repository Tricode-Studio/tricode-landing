import { motion, useScroll, useTransform } from 'framer-motion';
import { useMemo, useRef } from 'react';
import SplitText from './SplitText';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from '../lib/motion';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

const ROW_UNIT = 100;
const DESKTOP_X = [42, 58];
const MOBILE_WIDTH = 56;
const MOBILE_X = [18, 38];

function buildWavePath(xs: number[], rowUnit = ROW_UNIT): string {
  if (!xs.length) return '';
  const points = xs.map((x, i) => ({ x, y: (i + 0.5) * rowUnit }));
  let d = `M ${points[0].x} 0 L ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const midY = (a.y + b.y) / 2;
    d += ` C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x} ${points.length * rowUnit}`;
  return d;
}

export default function Process() {
  const { config } = useLandingData();
  const sectionLabel = trimmed(config.process?.sectionLabel);
  const titleTop = trimmed(config.process?.titleTop);
  const titleHighlight = trimmed(config.process?.titleHighlight);
  const description = trimmed(config.process?.description);
  const steps = Array.isArray(config.process?.steps)
    ? config.process.steps
        .map((step, index) => ({
          n: trimmed(step?.n) || String(index + 1).padStart(2, '0'),
          title: trimmed(step?.title),
          desc: trimmed(step?.desc),
        }))
        .filter((step) => step.title && step.desc)
    : [];

  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 78%', 'end 45%'],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const desktopXs = useMemo(
    () => steps.map((_, i) => DESKTOP_X[i % 2]),
    [steps],
  );
  const mobileXs = useMemo(() => steps.map((_, i) => MOBILE_X[i % 2]), [steps]);
  const desktopPath = useMemo(() => buildWavePath(desktopXs), [desktopXs]);
  const mobilePath = useMemo(() => buildWavePath(mobileXs), [mobileXs]);
  const viewBoxHeight = steps.length * ROW_UNIT;

  return (
    <section
      id="proceso"
      className="relative py-28 md:py-40 border-t border-white/5 overflow-hidden"
    >
      <div className="absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full bg-brand-indigo/10 blur-[160px]" />

      <div className="container-wide relative">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-end mb-16 md:mb-24">
          <div className="col-span-12 lg:col-span-8">
            {sectionLabel ? (
              <motion.div
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                className="eyebrow mb-7"
              >
                <span className="h-px w-8 bg-brand-purple/50" />
                {sectionLabel}
              </motion.div>
            ) : null}
            {(titleTop || titleHighlight) ? (
              <h2 className="display-xl text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[5.5rem]">
                {titleTop ? <SplitText as="span" text={titleTop} className="block text-white" /> : null}
                {titleHighlight ? (
                  <SplitText
                    as="span"
                    text={titleHighlight}
                    className="block mt-1"
                    wordClassName="italic-serif text-grad"
                    delay={0.2}
                  />
                ) : null}
              </h2>
            ) : null}
          </div>
          {description ? (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 }}
              className="col-span-12 lg:col-span-4 text-white/65 leading-relaxed text-base md:text-lg"
            >
              {description}
            </motion.p>
          ) : null}
        </div>

        {steps.length ? (
          <div ref={trackRef} className="relative">
            {/* Wavy spine - desktop: meanders between the alternating columns */}
            <svg
              className="hidden md:block absolute inset-0 h-full w-full"
              viewBox={`0 0 100 ${viewBoxHeight}`}
              preserveAspectRatio="none"
              fill="none"
              aria-hidden
            >
              <path
                d={desktopPath}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              <motion.path
                d={desktopPath}
                stroke="url(#process-wave-grad)"
                strokeWidth="1.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ pathLength }}
              />
              <defs>
                <linearGradient id="process-wave-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B9A7FF" />
                  <stop offset="55%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Wavy spine - mobile: narrow column hugging the left edge */}
            <svg
              className="md:hidden absolute left-0 inset-y-0 h-full"
              width={MOBILE_WIDTH}
              viewBox={`0 0 ${MOBILE_WIDTH} ${viewBoxHeight}`}
              preserveAspectRatio="none"
              fill="none"
              aria-hidden
            >
              <path
                d={mobilePath}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              <motion.path
                d={mobilePath}
                stroke="url(#process-wave-grad-mobile)"
                strokeWidth="1.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ pathLength }}
              />
              <defs>
                <linearGradient id="process-wave-grad-mobile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B9A7FF" />
                  <stop offset="55%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>
            </svg>

            <motion.ol
              variants={stagger(0.12, 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="relative flex flex-col"
            >
              {steps.map((step, index) => {
                const isRight = index % 2 === 1;
                return (
                  <motion.li
                    key={`${step.n}-${index}`}
                    variants={fadeUp}
                    className={`relative flex items-center py-8 md:py-12 md:min-h-[190px] pl-16 md:pl-0 ${
                      isRight ? 'md:justify-end' : 'md:justify-start'
                    }`}
                  >
                    {/* Node - desktop, sits on the wave at this step's alternating side */}
                    <span
                      className="hidden md:flex absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-7 items-center justify-center"
                      style={{ left: `${desktopXs[index]}%` }}
                    >
                      <span className="absolute h-7 w-7 rounded-full border border-brand-purple/35 group-hover:border-brand-purple transition-colors" />
                      <span className="h-2.5 w-2.5 rounded-full bg-grad-brand shadow-[0_0_14px_rgba(124,58,237,0.7)]" />
                    </span>

                    {/* Node - mobile, fixed to the narrow left spine */}
                    <span
                      className="md:hidden absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center"
                      style={{ left: mobileXs[index] }}
                    >
                      <span className="absolute h-6 w-6 rounded-full border border-brand-purple/40" />
                      <span className="h-2 w-2 rounded-full bg-grad-brand shadow-[0_0_14px_rgba(124,58,237,0.7)]" />
                    </span>

                    <div
                      className={`w-full md:w-[40%] ${isRight ? 'md:text-right' : ''}`}
                    >
                      <div
                        className={`font-mono text-[11px] uppercase tracking-[0.28em] text-brand-purple/85 mb-2`}
                      >
                        Etapa {step.n}
                      </div>
                      <h3 className="display-md text-2xl md:text-3xl text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-white/65 leading-relaxed text-sm md:text-base max-w-sm md:max-w-xs md:inline-block">
                        {step.desc}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ol>
          </div>
        ) : null}
      </div>
    </section>
  );
}

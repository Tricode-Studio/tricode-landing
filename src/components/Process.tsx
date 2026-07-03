import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import SplitText from './SplitText';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from '../lib/motion';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
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
    offset: ['start 80%', 'end 30%'],
  });
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

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
          <div ref={trackRef} className="relative pl-8 md:pl-14">
            {/* Background spine */}
            <div className="absolute left-2 md:left-5 top-0 bottom-0 w-px bg-white/10" />
            {/* Animated progress */}
            <motion.div
              style={{ height: progressHeight }}
              className="absolute left-2 md:left-5 top-0 w-px bg-gradient-to-b from-brand-violet via-brand-indigo to-transparent shadow-[0_0_18px_rgba(124,58,237,0.6)]"
            />

            <motion.ol
              variants={stagger(0.1, 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="flex flex-col gap-12 md:gap-16"
            >
              {steps.map((step, index) => (
                <motion.li
                  key={`${step.n}-${index}`}
                  variants={fadeUp}
                  className="relative group"
                >
                  {/* Node */}
                  <span className="absolute -left-[33px] md:-left-[57px] top-2 flex h-6 w-6 items-center justify-center">
                    <span className="absolute h-6 w-6 rounded-full border border-brand-purple/40 group-hover:border-brand-purple transition-colors" />
                    <span className="h-2 w-2 rounded-full bg-grad-brand shadow-[0_0_14px_rgba(124,58,237,0.7)]" />
                  </span>

                  <div className="grid grid-cols-12 gap-x-6 gap-y-3 items-baseline">
                    <div className="col-span-12 md:col-span-2 font-mono text-[11px] uppercase tracking-[0.28em] text-brand-purple/85">
                      Etapa {step.n}
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <h3 className="display-md text-3xl md:text-4xl text-white">
                        {step.title}
                      </h3>
                    </div>
                    <div className="col-span-12 md:col-span-6 text-white/70 leading-relaxed text-base md:text-lg">
                      {step.desc}
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        ) : null}
      </div>
    </section>
  );
}

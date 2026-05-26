import { motion } from 'framer-motion';
import Counter from './Counter';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from '../lib/motion';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export default function Stats() {
  const { config } = useLandingData();
  const stats = Array.isArray(config.stats)
    ? config.stats
        .map((item) => ({
          value: typeof item?.value === 'number' ? item.value : Number.NaN,
          prefix: trimmed(item?.prefix),
          suffix: trimmed(item?.suffix),
          label: trimmed(item?.label),
        }))
        .filter((item) => Number.isFinite(item.value) && item.label)
    : [];

  if (!stats.length) {
    return null;
  }

  return (
    <section
      id="stats"
      className="relative py-16 md:py-20 border-y border-white/5 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.015] to-transparent" />
      <div className="container-wide relative">
        <motion.div
          variants={stagger(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={`${stat.label}-${index}`}
              variants={fadeUp}
              className="relative text-center md:text-left md:pl-6 group"
            >
              <span
                aria-hidden
                className="hidden md:block absolute left-0 top-2 h-12 w-px bg-gradient-to-b from-brand-purple/60 via-brand-purple/20 to-transparent group-hover:from-brand-purple group-hover:via-brand-violet/60 transition-colors duration-500"
              />
              <div className="display-md text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-grad flex items-baseline justify-center md:justify-start gap-1 tabular-nums">
                {stat.prefix ? <span>{stat.prefix}</span> : null}
                <Counter to={stat.value} suffix={stat.suffix} />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.5 + index * 0.1 }}
                className="mt-3 text-[10px] sm:text-xs text-white/45 font-mono uppercase tracking-[0.22em] max-w-[14ch] mx-auto md:mx-0"
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import SplitText from './SplitText';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from '../lib/motion';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export default function Included() {
  const { config } = useLandingData();
  const sectionLabel = trimmed(config.included?.sectionLabel);
  const titleTop = trimmed(config.included?.titleTop);
  const titleHighlight = trimmed(config.included?.titleHighlight);
  const description = trimmed(config.included?.description);
  const items = Array.isArray(config.included?.items)
    ? config.included.items
        .map((item) => ({
          icon: trimmed(item?.icon),
          title: trimmed(item?.title),
          desc: trimmed(item?.desc),
        }))
        .filter((item) => item.title && item.desc)
    : [];

  if (!items.length) return null;

  return (
    <section
      className="relative py-28 md:py-40 border-t border-white/5 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-section02.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/55 to-ink-950" />
      <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-brand-indigo/8 blur-[160px]" />

      <div className="container-wide relative">
        <div className="max-w-4xl mb-16 md:mb-20">
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
            <h2 className="display-xl text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[5rem]">
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

          {description ? (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 }}
              className="mt-6 max-w-xl text-white/65 leading-relaxed text-base md:text-lg"
            >
              {description}
            </motion.p>
          ) : null}
        </div>

        <motion.div
          variants={stagger(0.08, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {items.map((item, index) => (
            <motion.article
              key={item.title}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] p-6 transition-all duration-500 hover:border-brand-purple/40 hover:bg-white/[0.045] hover:-translate-y-1"
            >
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand-violet/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-2xl text-brand-purple">{item.icon || '◆'}</span>
                  <span className="font-mono text-[10px] text-white/35">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-semibold text-white text-base">{item.title}</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

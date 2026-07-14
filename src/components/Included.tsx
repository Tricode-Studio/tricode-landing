import { motion } from 'framer-motion';
import SplitText from './SplitText';
import CardParticles from './CardParticles';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from '../lib/motion';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function IncludedIcon({ index }: { index: number }) {
  const common = 'h-6 w-6';
  // 0 · Dominio y correos profesionales
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.4 3.9 5.6 4 9-.1 3.4-1.5 6.6-4 9-2.5-2.4-3.9-5.6-4-9 .1-3.4 1.5-6.6 4-9Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // 1 · Hosting e infraestructura
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="3" y="4" width="18" height="7" rx="1.5" />
        <rect x="3" y="13" width="18" height="7" rx="1.5" />
        <path d="M7 7.5h.01M7 16.5h.01" strokeLinecap="round" />
      </svg>
    );
  }
  // 2 · CMS a medida incluido
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 4v16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // 3 · Mantenimiento y backups
  if (index === 3) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M21 12a9 9 0 1 1-3-6.7M21 4v4h-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // 4 · SEO técnico
  if (index === 4) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
    );
  }
  // 5 · Soporte directo
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M21 11.5a8.38 8.38 0 0 1-9 8.35L3 21l1.15-3.35A8.38 8.38 0 1 1 21 11.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
      className="sbg-included relative py-28 md:py-40 border-t border-white/5 overflow-hidden bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/55 to-ink-950" />

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
                  className="block mt-1 text-white"
                  markWord="ocultos"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {items.map((item, index) => (
            <motion.article
              key={item.title}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] p-6 transition-all duration-500 hover:border-brand-purple/40 hover:bg-white/[0.045] hover:-translate-y-1"
            >
              <CardParticles />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-xl bg-grad-soft border border-brand-purple/30 flex items-center justify-center text-brand-purple">
                    <IncludedIcon index={index} />
                  </div>
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

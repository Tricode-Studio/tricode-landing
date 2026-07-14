import { motion } from 'framer-motion';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, viewportOnce } from '../lib/motion';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export default function AboutTeaser() {
  const { config } = useLandingData();
  const sectionLabel = trimmed(config.about?.sectionLabel) || 'Nosotros';

  return (
    <section id="nosotros" className="relative py-24 md:py-32 border-t border-white/5 overflow-hidden">
      <div className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-brand-purple/8 blur-[170px]" />

      <div className="container-wide relative">
        <div className="grid grid-cols-12 gap-x-0 lg:gap-x-8 gap-y-10 items-center">
          <div className="col-span-12 lg:col-span-8">
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

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
              className="display-md text-3xl sm:text-4xl md:text-5xl text-white max-w-3xl leading-[1.08]"
            >
              Empezamos como tres amigos con la misma obsesión por{' '}
<span className="kw-mark">construir</span> bien.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.85, ease: EASE_OUT_EXPO, delay: 0.15 }}
              className="mt-6 max-w-2xl text-base md:text-lg text-white/60 leading-relaxed"
            >
              Cuando llegás a Tricode no hablás con un comercial: hablás directo con quien va a
              diseñar y desarrollar tu proyecto. Somos un estudio compacto a propósito, para
              meternos a fondo en cada producto.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.85, ease: EASE_OUT_EXPO, delay: 0.25 }}
            className="col-span-12 lg:col-span-4 lg:flex lg:justify-end"
          >
            <a
              href="/nosotros"
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] text-white transition-all duration-500 hover:border-white hover:bg-white hover:text-ink-950"
            >
              Conocé al equipo
              <span aria-hidden className="transition-transform group-hover:translate-x-1.5">→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

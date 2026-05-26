import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Spotlight from './Spotlight';
import SplitText from './SplitText';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from '../lib/motion';

const BRAND_MARK_SRC = '/isotipo.png?v=20260427-1';

const STORY_CHAPTERS = [
  {
    kicker: '01 — El origen',
    title: 'Tres personas, una misma obsesión.',
    body:
      'Tricode arrancó en Trinidad, Flores, a fines de 2023. Tres amigos que venían del mundo dev se encontraron pidiendo siempre lo mismo a los proyectos en los que trabajaban: claridad para el negocio, código que se pudiera mantener y diseño con criterio. Como no aparecía solo, decidieron hacerlo ellos.',
  },
  {
    kicker: '02 — La convicción',
    title: 'El software no se vende, se construye.',
    body:
      'No nos interesa cerrar un proyecto y desaparecer. Cada landing, sistema o CMS que entregamos lo pensamos como algo que va a vivir y crecer con la empresa: lo escribimos para que cualquier desarrollador pueda continuarlo, lo medimos, y volvemos a ajustarlo cuando hace falta.',
  },
  {
    kicker: '03 — Hoy',
    title: 'Un estudio pequeño con foco quirúrgico.',
    body:
      'Somos un equipo compacto a propósito. Trabajamos con pocas empresas a la vez para poder meternos a fondo en cada producto. Cuando llegás a Tricode, no hablás con un comercial: hablás directo con quien va a diseñar y desarrollar tu solución.',
  },
];

const LOGO_MEANINGS = [
  {
    label: 'Tres aristas',
    body: 'Representan a los tres socios fundadores y las tres disciplinas que conviven en el estudio: producto, diseño y código.',
  },
  {
    label: 'Letra T isométrica',
    body: 'La T de Tricode, dibujada en tres dimensiones. Nuestro trabajo es justamente eso: pensar cada producto desde múltiples ángulos antes de construirlo.',
  },
  {
    label: 'Gradiente violeta–azul',
    body: 'El violeta como creatividad, el azul como rigor técnico. Cuando se mezclan, aparece lo que buscamos en cada entrega.',
  },
];

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export default function About() {
  const { config } = useLandingData();
  const sectionLabel = trimmed(config.about?.sectionLabel);
  const titleTop = trimmed(config.about?.titleTop);
  const titleHighlight = trimmed(config.about?.titleHighlight);
  const description = trimmed(config.about?.description);
  const microStats =
    Array.isArray(config.about?.microStats)
      ? config.about.microStats
          .map((item) => ({ k: trimmed(item?.k), v: trimmed(item?.v) }))
          .filter((item) => item.k && item.v)
      : [];
  const pillars =
    Array.isArray(config.about?.pillars)
      ? config.about.pillars
          .map((item) => ({
            icon: trimmed(item?.icon),
            title: trimmed(item?.title),
            desc: trimmed(item?.desc),
          }))
          .filter((item) => item.title && item.desc)
      : [];
  const quoteText = trimmed(config.about?.quote?.text);
  const quoteHighlight = trimmed(config.about?.quote?.highlight);

  const logoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: logoRef,
    offset: ['start end', 'end start'],
  });
  const logoY = useTransform(scrollYProgress, [0, 1], [-40, 80]);
  const logoRotate = useTransform(scrollYProgress, [0, 1], [-8, 12]);

  return (
    <section
      id="nosotros"
      className="relative py-28 md:py-40 overflow-hidden border-t border-white/5"
    >
      <div className="absolute -top-32 left-1/3 h-[420px] w-[420px] rounded-full bg-brand-violet/10 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-brand-indigo/10 blur-[140px]" />

      <div className="container-wide relative">
        {/* Heading row */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-32 self-start">
            {sectionLabel ? (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                className="eyebrow mb-8"
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
                    className="block italic-serif text-grad mt-1"
                    delay={0.2}
                  />
                ) : null}
              </h2>
            ) : null}

            {description ? (
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 }}
                className="mt-8 text-base md:text-lg text-white/65 leading-relaxed max-w-xl"
              >
                {description}
              </motion.p>
            ) : null}

            {microStats.length ? (
              <motion.dl
                variants={stagger(0.08, 0.4)}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className="mt-10 grid grid-cols-3 gap-x-5 max-w-md"
              >
                {microStats.map((stat) => (
                  <motion.div
                    key={`${stat.k}-${stat.v}`}
                    variants={fadeUp}
                    className="border-l border-brand-purple/40 pl-3"
                  >
                    <dt className="display-md text-2xl md:text-3xl text-grad leading-none">
                      {stat.k}
                    </dt>
                    <dd className="mt-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/45">
                      {stat.v}
                    </dd>
                  </motion.div>
                ))}
              </motion.dl>
            ) : null}
          </div>

          {/* Chapters */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-12 md:gap-16">
            {STORY_CHAPTERS.map((chapter, index) => (
              <motion.article
                key={chapter.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: index * 0.08 }}
                className="relative pl-7 border-l border-white/10"
              >
                <span className="absolute left-[-6px] top-2 h-3 w-3 rounded-full bg-grad-brand shadow-[0_0_18px_rgba(139,92,246,0.6)]" />
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-brand-purple/85">
                  {chapter.kicker}
                </div>
                <h3 className="mt-3 display-md text-2xl md:text-4xl text-white">
                  {chapter.title}
                </h3>
                <p className="mt-4 text-white/65 leading-relaxed text-base md:text-lg max-w-2xl">
                  {chapter.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Logo meaning split section */}
        <div className="mt-32 md:mt-44 grid grid-cols-12 gap-x-6 gap-y-16 items-center">
          <motion.div
            ref={logoRef}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
            className="col-span-12 lg:col-span-5 relative flex items-center justify-center"
          >
            <div className="absolute inset-0 m-auto h-[80%] w-[80%] rounded-full bg-grad-brand blur-[120px] opacity-30" />
            <motion.div
              style={{ y: logoY, rotate: logoRotate }}
              className="relative w-full max-w-sm aspect-square flex items-center justify-center"
            >
              <motion.img
                src={BRAND_MARK_SRC}
                alt="Isotipo de Tricode"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full object-contain drop-shadow-[0_30px_80px_rgba(139,92,246,0.45)]"
              />
              {/* Orbit dots */}
              <span className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-spin-slow" />
              <span className="absolute inset-6 rounded-full border border-dashed border-white/[0.06]" />
            </motion.div>
          </motion.div>

          <div className="col-span-12 lg:col-span-7 lg:pl-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
              className="eyebrow mb-6"
            >
              <span className="h-px w-8 bg-brand-purple/50" />
              El significado del logo
            </motion.div>

            <h3 className="display-md text-3xl md:text-5xl text-white max-w-xl">
              Una <span className="italic-serif text-grad">T</span> que mira{' '}
              <span className="italic-serif text-grad">en tres dimensiones.</span>
            </h3>

            <motion.div
              variants={stagger(0.1, 0.2)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="mt-10 grid sm:grid-cols-3 gap-5"
            >
              {LOGO_MEANINGS.map((item) => (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  className="glass p-5 rounded-2xl"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand-purple/85">
                    {item.label}
                  </div>
                  <p className="mt-3 text-sm text-white/70 leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Pillars */}
        {pillars.length ? (
          <div className="mt-32 md:mt-44">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
              className="flex items-end justify-between gap-8 flex-wrap mb-10"
            >
              <div>
                <div className="eyebrow mb-4">
                  <span className="h-px w-8 bg-brand-purple/50" />
                  Lo que nos mueve
                </div>
                <h3 className="display-md text-3xl md:text-5xl text-white max-w-2xl">
                  Cuatro principios que no negociamos.
                </h3>
              </div>
            </motion.div>

            <motion.div
              variants={stagger(0.08, 0.2)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {pillars.map((pillar) => (
                <motion.div key={pillar.title} variants={fadeUp}>
                  <Spotlight as="div" className="card card-hover h-full p-6 rounded-2xl">
                    {pillar.icon ? (
                      <div className="text-3xl text-brand-purple leading-none">{pillar.icon}</div>
                    ) : null}
                    <div className="mt-5 font-medium text-white text-base">{pillar.title}</div>
                    <div className="mt-2 text-sm text-white/55 leading-relaxed">{pillar.desc}</div>
                  </Spotlight>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : null}

        {/* Quote */}
        {quoteText || quoteHighlight ? (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 1, ease: EASE_OUT_EXPO }}
            className="mt-32 md:mt-40 max-w-4xl mx-auto text-center"
          >
            <svg
              className="mx-auto h-10 w-10 text-brand-purple/60"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M9.13 8.05c-3.16.6-5.2 3-5.2 6.16 0 2.4 1.45 3.79 3.27 3.79 1.66 0 2.93-1.27 2.93-2.97 0-1.55-1.06-2.7-2.55-2.7-.32 0-.71.07-.79.07.22-1.59 1.78-3.43 3.55-4.4l-1.21.05zm9.07 0c-3.16.6-5.2 3-5.2 6.16 0 2.4 1.45 3.79 3.27 3.79 1.66 0 2.93-1.27 2.93-2.97 0-1.55-1.06-2.7-2.55-2.7-.32 0-.71.07-.79.07.22-1.59 1.78-3.43 3.55-4.4l-1.21.05z" />
            </svg>
            <blockquote className="mt-6 display-md text-2xl md:text-4xl leading-snug text-white/90">
              <span className="italic-serif">{quoteText}</span>
              {quoteHighlight ? (
                <span className="block mt-3 text-grad italic-serif">{quoteHighlight}</span>
              ) : null}
            </blockquote>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

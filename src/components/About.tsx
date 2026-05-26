import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { MouseEvent, useRef } from 'react';
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
    index: '01',
    label: 'Tres aristas',
    body: 'Los tres socios fundadores y las tres disciplinas que conviven en el estudio: producto, diseño y código.',
  },
  {
    index: '02',
    label: 'T isométrica',
    body: 'La T de Tricode dibujada en tres dimensiones. Pensamos cada producto desde múltiples ángulos antes de construirlo.',
  },
  {
    index: '03',
    label: 'Violeta y azul',
    body: 'Violeta como creatividad, azul como rigor técnico. Cuando se mezclan, aparece lo que buscamos en cada entrega.',
  },
];

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function InteractiveLogo() {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const sx = useSpring(rotateX, { stiffness: 80, damping: 18 });
  const sy = useSpring(rotateY, { stiffness: 80, damping: 18 });

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const py = ((e.clientY - r.top) / r.height - 0.5) * 2;
    rotateY.set(px * 18);
    rotateX.set(-py * 18);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative w-full max-w-md aspect-square flex items-center justify-center"
      style={{ perspective: 1200 }}
    >
      {/* Glow halo */}
      <div className="absolute inset-0 m-auto h-[85%] w-[85%] rounded-full bg-grad-brand opacity-25 blur-[120px]" />

      {/* Orbiting rings */}
      <span className="absolute inset-0 rounded-full border border-dashed border-bone-50/8 animate-spin-slow" />
      <span className="absolute inset-8 rounded-full border border-dashed border-bone-50/5" />
      <span className="absolute inset-16 rounded-full border border-bone-50/5" />

      <motion.img
        src={BRAND_MARK_SRC}
        alt="Isotipo de Tricode"
        style={{ rotateX: sx, rotateY: sy, transformStyle: 'preserve-3d' }}
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-3/4 h-3/4 object-contain drop-shadow-[0_40px_100px_rgba(139,92,246,0.5)] will-change-transform"
      />

      {/* Corner brackets */}
      <span className="absolute top-0 left-0 h-5 w-5 border-l border-t border-bone-50/15" />
      <span className="absolute top-0 right-0 h-5 w-5 border-r border-t border-bone-50/15" />
      <span className="absolute bottom-0 left-0 h-5 w-5 border-l border-b border-bone-50/15" />
      <span className="absolute bottom-0 right-0 h-5 w-5 border-r border-b border-bone-50/15" />

      <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.32em] text-bone-50/35 whitespace-nowrap">
        tri · code · 2023
      </span>
    </div>
  );
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

  const logoSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: logoSectionRef,
    offset: ['start end', 'end start'],
  });
  const sectionY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section
      id="nosotros"
      className="relative py-28 md:py-44 overflow-hidden border-t border-bone-50/5"
    >
      <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-brand-purple/8 blur-[160px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-brand-indigo/8 blur-[160px]" />

      <div className="container-wide relative">
        {/* Heading + Chapters */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-12">
          <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-32 self-start">
            {sectionLabel ? (
              <motion.div
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                className="eyebrow mb-8"
              >
                <span className="h-px w-10 bg-brand-lavender/40" />
                {sectionLabel}
              </motion.div>
            ) : null}

            {(titleTop || titleHighlight) ? (
              <h2 className="display-xl text-[2.4rem] sm:text-5xl md:text-6xl lg:text-[4.6rem]">
                {titleTop ? <SplitText as="span" text={titleTop} className="block text-bone-50" /> : null}
                {titleHighlight ? (
                  <SplitText
                    as="span"
                    text={titleHighlight}
                    className="block italic-serif text-grad mt-2"
                    delay={0.18}
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
                className="mt-8 text-base md:text-lg text-bone-50/65 leading-relaxed max-w-xl"
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
                    className="border-l border-brand-lavender/30 pl-3"
                  >
                    <dt className="display-md text-2xl md:text-3xl text-bone-50 leading-none">
                      {stat.k}
                    </dt>
                    <dd className="mt-2 text-[10px] font-mono uppercase tracking-[0.22em] text-bone-50/45">
                      {stat.v}
                    </dd>
                  </motion.div>
                ))}
              </motion.dl>
            ) : null}
          </div>

          <div className="col-span-12 lg:col-span-7 flex flex-col gap-14 md:gap-20">
            {STORY_CHAPTERS.map((chapter, index) => (
              <motion.article
                key={chapter.title}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.95, ease: EASE_OUT_EXPO, delay: index * 0.08 }}
                className="relative pl-8 border-l border-bone-50/10"
              >
                <span className="absolute left-[-5px] top-3 h-2.5 w-2.5 rounded-full bg-brand-lavender shadow-[0_0_18px_rgba(185,167,255,0.55)]" />
                <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-brand-lavender/85">
                  {chapter.kicker}
                </div>
                <h3 className="mt-4 display-md text-2xl md:text-4xl text-bone-50 max-w-xl">
                  {chapter.title}
                </h3>
                <p className="mt-5 text-bone-50/65 leading-relaxed text-base md:text-lg max-w-2xl">
                  {chapter.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Logo meaning split */}
        <div ref={logoSectionRef} className="mt-36 md:mt-52 grid grid-cols-12 gap-x-8 gap-y-16 items-center">
          <motion.div
            style={{ y: sectionY }}
            className="col-span-12 lg:col-span-5 relative flex items-center justify-center"
          >
            <InteractiveLogo />
          </motion.div>

          <div className="col-span-12 lg:col-span-7 lg:pl-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
              className="eyebrow mb-6"
            >
              <span className="h-px w-10 bg-brand-lavender/40" />
              El significado del logo
            </motion.div>

            <h3 className="display-md text-3xl md:text-5xl text-bone-50 max-w-xl">
              Una <span className="italic-serif text-grad">T</span> que mira{' '}
              <span className="italic-serif text-grad">en tres dimensiones.</span>
            </h3>

            <p className="mt-7 max-w-xl text-bone-50/60 leading-relaxed">
              Cada elemento del isotipo es una declaración silenciosa sobre cómo trabajamos. No es decoración:
              es la síntesis visual de nuestra forma de construir.
            </p>

            <motion.div
              variants={stagger(0.1, 0.2)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="mt-10 grid sm:grid-cols-3 gap-4"
            >
              {LOGO_MEANINGS.map((item) => (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  className="glass p-6 rounded-2xl group hover:border-brand-lavender/35 transition-colors duration-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="display-md text-2xl text-grad">{item.index}</span>
                    <span className="h-px flex-1 ml-4 bg-bone-50/10" />
                  </div>
                  <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-brand-lavender/90">
                    {item.label}
                  </div>
                  <p className="mt-3 text-sm text-bone-50/65 leading-relaxed">{item.body}</p>
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
              transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
              className="flex items-end justify-between gap-8 flex-wrap mb-12"
            >
              <div>
                <div className="eyebrow mb-5">
                  <span className="h-px w-10 bg-brand-lavender/40" />
                  Lo que nos mueve
                </div>
                <h3 className="display-md text-3xl md:text-5xl text-bone-50 max-w-2xl">
                  Cuatro principios <span className="italic-serif text-grad">que no negociamos.</span>
                </h3>
              </div>
            </motion.div>

            <motion.div
              variants={stagger(0.08, 0.15)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {pillars.map((pillar) => (
                <motion.div key={pillar.title} variants={fadeUp}>
                  <Spotlight as="div" className="card card-hover h-full p-6 rounded-2xl">
                    {pillar.icon ? (
                      <div className="text-3xl text-brand-lavender leading-none">{pillar.icon}</div>
                    ) : null}
                    <div className="mt-5 font-medium text-bone-50 text-base">{pillar.title}</div>
                    <div className="mt-2 text-sm text-bone-50/55 leading-relaxed">{pillar.desc}</div>
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
            className="mt-32 md:mt-44 max-w-4xl mx-auto text-center"
          >
            <svg
              className="mx-auto h-10 w-10 text-brand-lavender/50"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M9.13 8.05c-3.16.6-5.2 3-5.2 6.16 0 2.4 1.45 3.79 3.27 3.79 1.66 0 2.93-1.27 2.93-2.97 0-1.55-1.06-2.7-2.55-2.7-.32 0-.71.07-.79.07.22-1.59 1.78-3.43 3.55-4.4l-1.21.05zm9.07 0c-3.16.6-5.2 3-5.2 6.16 0 2.4 1.45 3.79 3.27 3.79 1.66 0 2.93-1.27 2.93-2.97 0-1.55-1.06-2.7-2.55-2.7-.32 0-.71.07-.79.07.22-1.59 1.78-3.43 3.55-4.4l-1.21.05z" />
            </svg>
            <blockquote className="mt-6 display-md text-2xl md:text-4xl leading-snug text-bone-50/90">
              <span className="italic-serif">{quoteText}</span>
              {quoteHighlight ? (
                <span className="block mt-4 text-grad italic-serif">{quoteHighlight}</span>
              ) : null}
            </blockquote>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import Nav from './Nav';
import Footer from './Footer';
import { useLenis } from '../hooks/useLenis';
import { EASE_OUT_EXPO, fadeUp, stagger } from '../lib/motion';

/**
 * Layout compartido de las páginas de política de privacidad (CMS y
 * Workspace). Dos decisiones importantes acá:
 *
 * 1. Todo lo que está por encima del fold (título, intro, chips) anima con
 *    `animate` al montar, NO con `whileInView`. La versión anterior envolvía
 *    las ~10 secciones en UN solo motion.div con whileInView + amount 0.2:
 *    para dispararse necesitaba el 20% de un contenedor de miles de px
 *    visible, cosa que no pasaba hasta scrollear — la página parecía vacía.
 *    Ahora cada sección observa su propia visibilidad con un umbral chico.
 *
 * 2. Índice lateral sticky (desktop) con scrollspy, estilo página legal de
 *    producto serio: se ve el mapa completo del documento y dónde estás.
 */

export type PolicyHighlight = {
  icon: () => JSX.Element;
  label: string;
};

export type PolicySection = {
  number: string;
  title: string;
  body: ReactNode;
  accent?: boolean;
  accentBadge?: ReactNode;
};

type Props = {
  titleLead: string;
  titleKeyword: string;
  titleTail: string;
  intro: string;
  appLabel: string;
  lastUpdated: string;
  contactEmail: string;
  highlights: PolicyHighlight[];
  sections: PolicySection[];
};

function sectionAnchorId(section: PolicySection) {
  return `seccion-${section.number}`;
}

export default function PrivacyPolicyLayout({
  titleLead,
  titleKeyword,
  titleTail,
  intro,
  appLabel,
  lastUpdated,
  contactEmail,
  highlights,
  sections,
}: Props) {
  useLenis();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scrollspy del índice: banda central del viewport, igual que en la Nav.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const targets = sections
      .map((section) => document.getElementById(sectionAnchorId(section)))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-25% 0px -65% 0px' },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Nav />

      <main className="pt-32 md:pt-40 pb-24 md:pb-32">
        {/* Encabezado */}
        <section className="relative">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-brand-violet/15 blur-[140px]" />
          <div className="container-x relative">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            >
              <a
                href="/"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors mb-8"
              >
                <span aria-hidden>←</span>
                Volver al inicio
              </a>

              <div className="label mb-4">{'// política de privacidad'}</div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.08 }}
              className="display-xl text-[2.15rem] sm:text-5xl md:text-6xl text-white max-w-4xl leading-[1.04]"
            >
              {titleLead} <span className="kw-mark">{titleKeyword}</span> {titleTail}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.18 }}
              className="mt-6 text-white/62 max-w-2xl text-base md:text-lg"
            >
              {intro}
            </motion.p>

            {/* Metadatos del documento */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.26 }}
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/45"
            >
              <span className="inline-flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-brand-purple" />
                {appLabel}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-brand-purple" />
                Actualizada el {lastUpdated}
              </span>
            </motion.div>

            {highlights.length ? (
              <motion.div
                variants={stagger(0.07, 0.34)}
                initial="hidden"
                animate="show"
                className="mt-8 flex flex-wrap gap-3 max-w-3xl"
              >
                {highlights.map(({ icon: Icon, label }) => (
                  <motion.div
                    key={label}
                    variants={fadeUp}
                    className="glass flex items-center gap-2.5 rounded-full border border-white/10 px-4 py-2.5 text-[13px] text-white/75"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                      <Icon />
                    </span>
                    {label}
                  </motion.div>
                ))}
              </motion.div>
            ) : null}
          </div>
        </section>

        {/* Cuerpo: índice sticky + documento */}
        <section className="mt-14 md:mt-20">
          <div className="container-x">
            <div className="grid gap-12 lg:grid-cols-12">
              {/* Índice (desktop) */}
              <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
                <div className="sticky top-28">
                  <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
                    Contenido
                  </div>
                  <ol className="flex flex-col border-l border-white/10">
                    {sections.map((section) => {
                      const anchorId = sectionAnchorId(section);
                      const isActive = activeSection === anchorId;
                      return (
                        <li key={section.number}>
                          <a
                            href={`#${anchorId}`}
                            className={`-ml-px flex items-baseline gap-3 border-l py-2 pl-4 text-[13px] leading-snug transition-colors duration-300 ${
                              isActive
                                ? 'border-brand-lavender text-white'
                                : 'border-transparent text-white/50 hover:border-white/25 hover:text-white/80'
                            }`}
                          >
                            <span className="font-mono text-[10px] tabular-nums text-brand-purple/70">
                              {section.number}
                            </span>
                            {section.title}
                          </a>
                        </li>
                      );
                    })}
                  </ol>
                  <div className="mt-8 border-t border-white/8 pt-5 text-[12px] leading-relaxed text-white/40">
                    ¿Consultas sobre tus datos?
                    <a
                      href={`mailto:${contactEmail}`}
                      className="mt-1 block font-mono text-[11px] text-white/60 transition-colors hover:text-white"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>
              </aside>

              {/* Documento */}
              <div className="lg:col-span-8 xl:col-span-8 max-w-3xl">
                {sections.map((section, index) => {
                  const anchorId = sectionAnchorId(section);
                  const inner = (
                    <>
                      <div className="flex items-center gap-4">
                        <span
                          className={`display-md text-2xl md:text-3xl ${
                            section.accent ? 'text-emerald-400' : 'text-grad'
                          }`}
                        >
                          {section.number}
                        </span>
                        <h2 className="text-lg md:text-xl font-semibold text-white">
                          {section.title}
                        </h2>
                        {section.accentBadge ? (
                          <span className="ml-auto hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                            {section.accentBadge}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-4 text-[15px] leading-relaxed text-white/65 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:pl-1">
                        {section.body}
                      </div>
                    </>
                  );

                  return (
                    <motion.article
                      key={section.number}
                      id={anchorId}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                      className="scroll-mt-28"
                    >
                      {section.accent ? (
                        <div className="relative my-8 overflow-hidden rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.04] p-6 md:p-7 first:mt-0">
                          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-[80px]" />
                          <div className="relative">{inner}</div>
                        </div>
                      ) : (
                        <div
                          className={`py-8 md:py-9 ${index === 0 ? 'pt-0 md:pt-0' : 'border-t border-white/8'}`}
                        >
                          {inner}
                        </div>
                      )}
                    </motion.article>
                  );
                })}

                {/* Cierre: contacto + fecha */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                  className="mt-6"
                >
                  <div className="glass flex flex-col gap-5 rounded-2xl border border-white/10 p-6 md:p-8 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-base font-semibold text-white">
                        ¿Dudas sobre esta política?
                      </div>
                      <p className="mt-1 text-sm text-white/60">
                        Escribinos y te respondemos en 24h hábiles.
                      </p>
                    </div>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="btn-primary btn-sheen shrink-0 justify-center"
                    >
                      {contactEmail}
                    </a>
                  </div>
                  <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
                    Última actualización: {lastUpdated}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

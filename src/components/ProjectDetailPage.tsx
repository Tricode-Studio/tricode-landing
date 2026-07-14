import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Nav from './Nav';
import Footer from './Footer';
import { useReveal } from '../hooks/useReveal';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from '../lib/motion';
import type { Project } from '../types/project';

type Props = {
  slug: string;
};

function resolveLiveUrl(rawUrl?: string) {
  const value = rawUrl?.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('//')) return `https:${value}`;
  return `https://${value}`;
}

function QuoteMark() {
  return (
    <svg className="h-8 w-8 text-brand-lavender/50" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.13 8.05c-3.16.6-5.2 3-5.2 6.16 0 2.4 1.45 3.79 3.27 3.79 1.66 0 2.93-1.27 2.93-2.97 0-1.55-1.06-2.7-2.55-2.7-.32 0-.71.07-.79.07.22-1.59 1.78-3.43 3.55-4.4l-1.21.05zm9.07 0c-3.16.6-5.2 3-5.2 6.16 0 2.4 1.45 3.79 3.27 3.79 1.66 0 2.93-1.27 2.93-2.97 0-1.55-1.06-2.7-2.55-2.7-.32 0-.71.07-.79.07.22-1.59 1.78-3.43 3.55-4.4l-1.21.05z" />
    </svg>
  );
}

function MetricsRow({ metrics }: { metrics: Project['metrics'] }) {
  if (!metrics.length) return null;
  return (
    <section className="mt-10 md:mt-14">
      <div className="container-x">
        <motion.div
          variants={stagger(0.08, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]"
        >
          {metrics.slice(0, 4).map((metric, index) => (
            <motion.div
              key={`${metric.label}-${index}`}
              variants={fadeUp}
              className="bg-ink-950 px-5 py-6 text-center sm:text-left"
            >
              <div className="display-md text-2xl sm:text-3xl text-grad">{metric.value}</div>
              <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function NarrativeSection({ eyebrow, text }: { eyebrow: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
    >
      <div className="eyebrow mb-4">
        <span className="h-px w-6 bg-brand-purple/50" />
        {eyebrow}
      </div>
      <div className="space-y-4 text-white/70 text-base md:text-lg leading-relaxed">
        {text.split('\n').filter(Boolean).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </motion.div>
  );
}

function Gallery({ images, name }: { images: string[]; name: string }) {
  if (!images.length) return null;
  return (
    <section className="mt-16 md:mt-24">
      <div className="container-x">
        <div className="eyebrow mb-6">
          <span className="h-px w-8 bg-brand-purple/50" />
          Galería
        </div>
        <motion.div
          variants={stagger(0.08, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {images.map((src, index) => (
            <motion.div
              key={`${src}-${index}`}
              variants={fadeUp}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-ink-900"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={src}
                  alt={`${name} — imagen ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Testimonial({ testimonial }: { testimonial: Project['testimonial'] }) {
  if (!testimonial) return null;
  return (
    <section className="mt-24 md:mt-32">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12 text-center"
        >
          <div className="flex justify-center">
            <QuoteMark />
          </div>
          <blockquote className="mt-6 display-md text-xl md:text-3xl leading-snug text-white/90">
            <span className="italic-serif">{testimonial.quote}</span>
          </blockquote>
          {testimonial.author ? (
            <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
              {testimonial.author}
              {testimonial.role ? <span className="text-white/30"> · {testimonial.role}</span> : null}
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}

export default function ProjectDetailPage({ slug }: Props) {
  const { projects, projectsReady } = useLandingData();
  useReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const project = projects.find((item) => item.slug === slug);
  const liveUrl = resolveLiveUrl(project?.url);
  // Case study estructurado (problema/enfoque/resultado); si no está cargado
  // todavía, cae al cuerpo genérico `long` para no dejar la página vacía.
  const hasNarrative = Boolean(project?.problem || project?.approach || project?.result);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Nav />

      <main className="pt-32 md:pt-40 pb-24 md:pb-32">
        <section className="relative">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[460px] w-[760px] rounded-full bg-brand-violet/12 blur-[150px]" />
          <div className="container-x relative">
            <a
              href="/proyectos"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors mb-8"
            >
              <span aria-hidden>←</span>
              Volver a proyectos
            </a>

            {!projectsReady ? (
              // Deep-link antes de que carguen los proyectos del CMS.
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-sm text-white/60">
                Cargando proyecto…
              </div>
            ) : !project ? (
              <div className="max-w-xl">
                <h1 className="display-md text-3xl md:text-4xl text-white">
                  No encontramos ese proyecto.
                </h1>
                <p className="mt-4 text-white/60">
                  Puede que haya cambiado de dirección o ya no esté publicado.
                </p>
                <a href="/proyectos" className="btn-primary mt-8">
                  Ver todos los proyectos
                  <span aria-hidden>→</span>
                </a>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  {project.category ? (
                    <span className="rounded-full border border-brand-purple/40 bg-brand-purple/10 px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-brand-lavender">
                      {project.category}
                    </span>
                  ) : null}
                  {project.year ? (
                    <span className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 font-mono text-[10px] text-white/55">
                      {project.year}
                    </span>
                  ) : null}
                </div>

                <h1 className="display-xl text-[2.15rem] sm:text-5xl md:text-6xl lg:text-7xl text-white max-w-4xl leading-[1.03] break-words hyphens-auto">
                  {project.name}
                </h1>

                {project.short ? (
                  <p className="mt-6 text-white/65 max-w-2xl text-base md:text-lg leading-relaxed">
                    {project.short}
                  </p>
                ) : null}

                {liveUrl ? (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-2.5 mt-8 rounded-full bg-bone-50 px-7 py-3.5 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-mist"
                  >
                    Ver en vivo
                    <span aria-hidden className="transition-transform group-hover:translate-x-1.5">↗</span>
                  </a>
                ) : null}
              </>
            )}
          </div>
        </section>

        {project ? (
          <>
            {project.image ? (
              <section className="mt-14 md:mt-20">
                <div className="container-x">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{ duration: 1, ease: EASE_OUT_EXPO }}
                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900"
                  >
                    <div className="aspect-[16/9]">
                      <img
                        src={project.image}
                        alt={project.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {project.accent ? (
                      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.accent} mix-blend-overlay opacity-40`} />
                    ) : null}
                  </motion.div>
                </div>
              </section>
            ) : null}

            <MetricsRow metrics={project.metrics} />

            <section className="mt-16 md:mt-24">
              <div className="container-x">
                <div className="grid grid-cols-12 gap-x-0 lg:gap-x-8 gap-y-12">
                  <div className="col-span-12 lg:col-span-8">
                    {hasNarrative ? (
                      <div className="max-w-2xl space-y-12">
                        {project.problem ? (
                          <NarrativeSection eyebrow="El problema" text={project.problem} />
                        ) : null}
                        {project.approach ? (
                          <NarrativeSection eyebrow="Nuestro enfoque" text={project.approach} />
                        ) : null}
                        {project.result ? (
                          <NarrativeSection eyebrow="El resultado" text={project.result} />
                        ) : null}
                      </div>
                    ) : project.long ? (
                      <div className="max-w-2xl space-y-5 text-white/70 text-base md:text-lg leading-relaxed">
                        {project.long.split('\n').filter(Boolean).map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="max-w-2xl text-white/60 text-base md:text-lg leading-relaxed">
                        {project.short || 'Un proyecto que combina diseño, código y producto.'}
                      </p>
                    )}
                  </div>

                  <aside className="col-span-12 lg:col-span-4 lg:pl-8 lg:border-l lg:border-white/10">
                    {project.tags.length ? (
                      <>
                        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-4">
                          Stack y foco
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/65"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : null}

                    {liveUrl ? (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/80 hover:text-white"
                      >
                        <span className="link-reveal">Visitar el sitio</span>
                        <span aria-hidden className="transition-transform group-hover:translate-x-1.5">↗</span>
                      </a>
                    ) : null}
                  </aside>
                </div>
              </div>
            </section>

            <Gallery images={project.gallery} name={project.name} />
            <Testimonial testimonial={project.testimonial} />

            <section className="mt-24 md:mt-32">
              <div className="container-x text-center">
                <div className="label mb-4">{'// siguiente paso'}</div>
                <h2 className="display-md text-3xl md:text-5xl text-white">
                  ¿Querés algo así para tu <span className="kw-mark">marca</span>?
                </h2>
                <a href="/brief" className="btn-primary mt-8">
                  Empezar un proyecto
                  <span aria-hidden>→</span>
                </a>
              </div>
            </section>
          </>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

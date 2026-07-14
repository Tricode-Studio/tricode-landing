import { useEffect, useMemo, useState } from 'react';
import ProjectCard from './ProjectCard';
import Nav from './Nav';
import Footer from './Footer';
import { useReveal } from '../hooks/useReveal';
import { useLandingData } from '../content/LandingDataContext';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalize(value: string) {
  // NFD descompone acentos en marcas combinantes; el filtro final a [a-z0-9]
  // ya las elimina, así "E-commerce", "Reservas" y "reserva" matchean igual.
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]/g, '');
}

function normalizeBackToHomeHref(href: string) {
  if (!href) return '/';
  if (href.startsWith('#/')) return href.slice(1);
  if (href === '#') return '/';
  return href;
}

function normalizeProjectsCtaHref(href: string) {
  if (!href) return href;
  if (href.startsWith('#/#')) return href.slice(2);
  if (href.startsWith('#/')) return href.slice(1);
  if (href.startsWith('#')) return `/${href}`;
  return href;
}

export default function ProjectsPage() {
  const { projects, projectsReady, config } = useLandingData();
  useReveal();
  const pageLabel = trimmed(config.projects?.pageLabel);
  const pageTitle = trimmed(config.projects?.pageTitle);
  const pageDescription = trimmed(config.projects?.pageDescription);
  const filters =
    Array.isArray(config.projects?.pageFilters)
      ? config.projects.pageFilters.map((value) => trimmed(value)).filter(Boolean)
      : [];
  const pageCtaLabel = trimmed(config.projects?.pageCtaLabel);
  const pageCtaHref = normalizeProjectsCtaHref(trimmed(config.projects?.pageCtaHref));
  const backToHomeLabel = trimmed(config.projects?.backToHomeLabel);
  const backToHomeHref = normalizeBackToHomeHref(trimmed(config.projects?.backToHomeHref));
  const pageEmptyStateLabel = trimmed(config.projects?.pageEmptyStateLabel);
  const nextStepLabel = trimmed(config.projects?.nextStepLabel);
  const nextStepTitleTop = trimmed(config.projects?.nextStepTitleTop);
  const nextStepTitleHighlight = trimmed(config.projects?.nextStepTitleHighlight);
  const cardCtaLabel = trimmed(config.projects?.cardCtaLabel);

  // El primer filtro ("Todos") muestra todo; el resto matchea contra la
  // categoría o los tags del proyecto (normalizado, tolerante a acentos/guiones).
  const [activeFilter, setActiveFilter] = useState(0);
  const visibleProjects = useMemo(() => {
    if (activeFilter <= 0 || !filters.length) {
      return projects;
    }
    const needle = normalize(filters[activeFilter] ?? '');
    if (!needle) return projects;
    return projects.filter((project) => {
      const haystack = [project.category, ...(project.tags ?? [])]
        .map((value) => normalize(trimmed(value)))
        .filter(Boolean);
      return haystack.some((value) => value.includes(needle) || needle.includes(value));
    });
  }, [projects, filters, activeFilter]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Nav />

      <main className="pt-32 md:pt-40 pb-24 md:pb-32">
        <section className="relative">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-brand-violet/15 blur-[140px]" />
          <div className="container-x relative">
            {backToHomeLabel && backToHomeHref ? (
              <a
                href={backToHomeHref}
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors mb-8 reveal"
              >
                <span aria-hidden>←</span>
                {backToHomeLabel}
              </a>
            ) : null}
            {pageLabel ? <div className="label mb-4 reveal">{pageLabel}</div> : null}
            {pageTitle ? (
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight max-w-4xl reveal reveal-delay-1">
                {pageTitle}
              </h1>
            ) : null}
            {pageDescription ? (
              <p className="mt-6 text-white/60 max-w-2xl text-base md:text-lg reveal reveal-delay-2">
                {pageDescription}
              </p>
            ) : null}

            {projectsReady && projects.length ? (
              <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.24em] text-white/40 reveal reveal-delay-2">
                {visibleProjects.length}
                {activeFilter > 0 ? ` de ${projects.length}` : ''} proyecto
                {(activeFilter > 0 ? visibleProjects.length : projects.length) === 1 ? '' : 's'}
              </div>
            ) : null}

            {filters.length ? (
              <div className="mt-8 flex flex-wrap gap-3 reveal reveal-delay-3">
                {filters.map((filterLabel, index) => (
                  <button
                    key={`${filterLabel}-${index}`}
                    type="button"
                    onClick={() => setActiveFilter(index)}
                    aria-pressed={index === activeFilter}
                    className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                      index === activeFilter
                        ? 'bg-brand-purple/20 border border-brand-purple/50 text-white'
                        : 'border border-white/10 text-white/60 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {filterLabel}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="mt-16 md:mt-24">
          <div className="container-x">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {!projectsReady ? (
                // Skeletons mientras carga el CMS -- evita el flash de "no hay proyectos".
                Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900/40"
                  >
                    <div className="aspect-[16/10] bg-white/[0.03]" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 w-2/3 rounded bg-white/[0.06]" />
                      <div className="h-3 w-full rounded bg-white/[0.04]" />
                      <div className="h-3 w-4/5 rounded bg-white/[0.04]" />
                    </div>
                  </div>
                ))
              ) : visibleProjects.length ? (
                visibleProjects.map((project, index) => (
                  <div key={project.slug || `${project.name}-${index}`} className="reveal" style={{ transitionDelay: `${(index % 3) * 80}ms` }}>
                    <ProjectCard project={project} ctaLabel={cardCtaLabel} />
                  </div>
                ))
              ) : pageEmptyStateLabel ? (
                <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/65">
                  {activeFilter > 0
                    ? 'No hay proyectos en esta categoría todavía.'
                    : pageEmptyStateLabel}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {(nextStepLabel || nextStepTitleTop || nextStepTitleHighlight || (pageCtaLabel && pageCtaHref)) ? (
          <section className="mt-24 md:mt-32">
            <div className="container-x text-center">
              {nextStepLabel ? <div className="label mb-4 reveal">{nextStepLabel}</div> : null}
              {(nextStepTitleTop || nextStepTitleHighlight) ? (
                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight reveal reveal-delay-1">
                  {nextStepTitleTop}
                  {nextStepTitleHighlight ? (
                    <>
                      {' '}
                      <span className="text-grad">{nextStepTitleHighlight}</span>
                    </>
                  ) : null}
                </h2>
              ) : null}
              {pageCtaLabel && pageCtaHref ? (
                <a href={pageCtaHref} className="btn-primary mt-8 reveal reveal-delay-2">
                  {pageCtaLabel}
                  <span aria-hidden>→</span>
                </a>
              ) : null}
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

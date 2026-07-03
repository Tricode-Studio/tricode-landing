import { useEffect } from 'react';
import ProjectCard from './ProjectCard';
import Nav from './Nav';
import Footer from './Footer';
import { useReveal } from '../hooks/useReveal';
import { useLandingData } from '../content/LandingDataContext';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
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
  const { projects, config } = useLandingData();
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

            {filters.length ? (
              <div className="mt-8 flex flex-wrap gap-3 reveal reveal-delay-3">
                {filters.map((filterLabel, index) => (
                  <button
                    key={`${filterLabel}-${index}`}
                    className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                      index === 0
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
              {projects.length
                ? projects.map((project, index) => (
                    <div key={project.slug || `${project.name}-${index}`} className="reveal" style={{ transitionDelay: `${(index % 3) * 80}ms` }}>
                      <ProjectCard project={project} ctaLabel={cardCtaLabel} />
                    </div>
                  ))
                : pageEmptyStateLabel
                  ? (
                    <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/65">
                      {pageEmptyStateLabel}
                    </div>
                    )
                  : null}
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

import ProjectCard from './ProjectCard';
import { useLandingData } from '../content/LandingDataContext';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeProjectsHref(href: string) {
  if (!href) return href;
  if (href.startsWith('#/')) return href.slice(1);
  return href;
}

export default function Projects() {
  const { projects, config } = useLandingData();
  const featuredLimit =
    typeof config.projects?.featuredLimit === 'number' && config.projects.featuredLimit > 0
      ? Math.floor(config.projects.featuredLimit)
      : projects.length;
  const featured = projects.slice(0, featuredLimit);
  const sectionLabel = trimmed(config.projects?.sectionLabel);
  const title = trimmed(config.projects?.title);
  const titleHighlight = trimmed(config.projects?.titleHighlight);
  const description = trimmed(config.projects?.description);
  const viewAllLabel = trimmed(config.projects?.viewAllLabel);
  const viewAllHref = normalizeProjectsHref(trimmed(config.projects?.viewAllHref));
  const cardCtaLabel = trimmed(config.projects?.cardCtaLabel);
  const emptyStateLabel = trimmed(config.projects?.emptyStateLabel);

  return (
    <section id="proyectos" className="relative py-24 md:py-32 border-t border-white/5">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8">
          <div>
            {sectionLabel ? <div className="label mb-4 reveal">{sectionLabel}</div> : null}
            {(title || titleHighlight) ? (
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-3xl reveal reveal-delay-1">
                {title}
                {titleHighlight ? (
                  <>
                    <br />
                    <span className="text-grad">{titleHighlight}</span>
                  </>
                ) : null}
              </h2>
            ) : null}
            {description ? <p className="mt-5 text-white/60 max-w-2xl reveal reveal-delay-2">{description}</p> : null}
          </div>
          {viewAllLabel && viewAllHref ? (
            <a href={viewAllHref} className="btn-ghost reveal reveal-delay-3 group self-start md:self-auto">
              {viewAllLabel}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          ) : null}
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.length
            ? featured.map((project, index) => (
                <div key={project.slug || `${project.name}-${index}`} className="reveal" style={{ transitionDelay: `${(index % 3) * 80}ms` }}>
                  <ProjectCard project={project} ctaLabel={cardCtaLabel} />
                </div>
              ))
            : emptyStateLabel
              ? (
                <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/65">
                  {emptyStateLabel}
                </div>
                )
              : null}
        </div>
      </div>
    </section>
  );
}

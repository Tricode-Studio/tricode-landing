import type { Project } from '../types/project';
import Spotlight from './Spotlight';

type Props = {
  project: Project;
  ctaLabel?: string;
};

function resolveProjectHref(rawUrl?: string) {
  const trimmed = rawUrl?.trim();
  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return { href: trimmed, external: true };
  }

  if (trimmed.startsWith('//')) {
    return { href: `https:${trimmed}`, external: true };
  }

  return { href: `https://${trimmed}`, external: true };
}

export default function ProjectCard({ project, ctaLabel }: Props) {
  const link = resolveProjectHref(project.url);

  return (
    <Spotlight
      as="article"
      className="relative overflow-hidden rounded-2xl border border-white/5 bg-ink-900/40 group h-full flex flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            decoding="async"
            draggable={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-ink-900" />
        )}
        {project.accent ? <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} mix-blend-overlay`} /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {project.category ? (
            <span className="rounded-full border border-white/15 bg-ink-900/70 backdrop-blur-md px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/80">
              {project.category}
            </span>
          ) : null}
          {project.year ? (
            <span className="rounded-full border border-white/15 bg-ink-900/70 backdrop-blur-md px-2 py-0.5 font-mono text-[9px] text-white/60">
              {project.year}
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {project.name ? <h3 className="text-lg font-semibold tracking-tight text-white">{project.name}</h3> : null}
        {project.short ? <p className="mt-1.5 text-sm text-white/60 leading-relaxed">{project.short}</p> : null}

        {project.tags.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/65"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {link && ctaLabel ? (
          <a
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noreferrer noopener' : undefined}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/85 transition-all hover:border-brand-purple/50 hover:bg-brand-purple/10 hover:text-white group/btn"
          >
            {ctaLabel}
            <span aria-hidden className="transition-transform group-hover/btn:translate-x-1">
              →
            </span>
          </a>
        ) : null}
      </div>
    </Spotlight>
  );
}

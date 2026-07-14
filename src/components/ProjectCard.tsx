import { motion } from 'framer-motion';
import type { Project } from '../types/project';
import { EASE_OUT_EXPO } from '../lib/motion';

type Props = {
  project: Project;
  ctaLabel?: string;
};

export default function ProjectCard({ project, ctaLabel }: Props) {
  const href = `/proyectos/${encodeURIComponent(project.slug)}`;

  return (
    <motion.a
      href={href}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      className="relative overflow-hidden rounded-2xl border border-bone-50/[0.06] bg-ink-900/40 group h-full flex flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-900">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            decoding="async"
            draggable={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
          />
        ) : null}
        {project.accent ? (
          <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} mix-blend-overlay opacity-70`} />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/30 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {project.category ? (
            <span className="rounded-full border border-bone-50/15 bg-ink-950/70 backdrop-blur-md px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-bone-50/85">
              {project.category}
            </span>
          ) : null}
          {project.year ? (
            <span className="rounded-full border border-bone-50/12 bg-ink-950/70 backdrop-blur-md px-2.5 py-1 font-mono text-[9px] text-bone-50/60">
              {project.year}
            </span>
          ) : null}
        </div>

        {/* Hover arrow */}
        <div className="absolute right-4 bottom-4 h-10 w-10 rounded-full bg-bone-50 text-ink-950 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
          <span aria-hidden className="text-base">↗</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {project.name ? (
          <h3 className="display-md text-xl text-bone-50 leading-tight">{project.name}</h3>
        ) : null}
        {project.short ? (
          <p className="mt-2 text-sm text-bone-50/55 leading-relaxed">{project.short}</p>
        ) : null}

        {project.tags.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-bone-50/8 bg-bone-50/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-bone-50/55"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-bone-50/80 group-hover:text-bone-50">
          <span className="link-reveal">{ctaLabel || 'Ver proyecto'}</span>
          <span aria-hidden className="transition-transform group-hover:translate-x-1.5">→</span>
        </span>
      </div>
    </motion.a>
  );
}

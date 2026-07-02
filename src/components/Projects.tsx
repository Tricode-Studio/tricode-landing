import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import SplitText from './SplitText';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from '../lib/motion';

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
  // El backend ya devuelve los proyectos en el orden manual (data.position)
  // definido por drag&drop en apps/workspace -- acá solo filtramos por
  // "destacado" y recortamos, sin volver a ordenar nada.
  const featured = projects.filter((project) => project.featured).slice(0, featuredLimit);
  const sectionLabel = trimmed(config.projects?.sectionLabel);
  const title = trimmed(config.projects?.title);
  const titleHighlight = trimmed(config.projects?.titleHighlight);
  const description = trimmed(config.projects?.description);
  const viewAllLabel = trimmed(config.projects?.viewAllLabel);
  const viewAllHref = normalizeProjectsHref(trimmed(config.projects?.viewAllHref));
  const cardCtaLabel = trimmed(config.projects?.cardCtaLabel);
  const emptyStateLabel = trimmed(config.projects?.emptyStateLabel);

  return (
    <section
      id="proyectos"
      className="relative py-28 md:py-40 border-t border-white/5 overflow-hidden"
    >
      <div className="absolute top-1/4 right-0 h-[400px] w-[400px] rounded-full bg-brand-indigo/10 blur-[160px]" />

      <div className="container-wide relative">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-end mb-16 md:mb-20">
          <div className="col-span-12 lg:col-span-8">
            {sectionLabel ? (
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
            ) : null}
            {(title || titleHighlight) ? (
              <h2 className="display-xl text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[5.5rem]">
                {title ? <SplitText as="span" text={title} className="block text-white" /> : null}
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
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 }}
                className="mt-7 text-white/65 leading-relaxed text-base md:text-lg max-w-2xl"
              >
                {description}
              </motion.p>
            ) : null}
          </div>
          {viewAllLabel && viewAllHref ? (
            <motion.a
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.4 }}
              href={viewAllHref}
              className="col-span-12 lg:col-span-4 lg:text-right group inline-flex lg:justify-end items-center gap-3 font-mono text-[12px] uppercase tracking-[0.22em] text-white/80 hover:text-white"
            >
              <span className="link-reveal">{viewAllLabel}</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1.5">
                →
              </span>
            </motion.a>
          ) : null}
        </div>

        {featured.length ? (
          <motion.div
            variants={stagger(0.08, 0.15)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {featured.map((project, index) => (
              <motion.div
                key={project.slug || `${project.name}-${index}`}
                variants={fadeUp}
              >
                <ProjectCard project={project} ctaLabel={cardCtaLabel} />
              </motion.div>
            ))}
          </motion.div>
        ) : emptyStateLabel ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/65">
            {emptyStateLabel}
          </div>
        ) : null}
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import SplitText from './SplitText';
import MagneticButton from './MagneticButton';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from '../lib/motion';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function CmsPanel({
  title,
  subtitle,
  metricLabel,
  metricValue,
  entities,
}: {
  title: string;
  subtitle: string;
  metricLabel: string;
  metricValue: string;
  entities: string[];
}) {
  const safeEntities = entities.length ? entities : ['Proyectos', 'Servicios', 'Equipo'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 6 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
      className="relative rounded-2xl border border-bone-50/10 bg-ink-900/85 backdrop-blur-2xl shadow-[0_50px_140px_-50px_rgba(139,92,246,0.5)] overflow-hidden"
      style={{ transformPerspective: 1400 }}
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-bone-50/[0.06] bg-ink-950/40">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-bone-50/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-bone-50/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-bone-50/15" />
        </div>
        <div className="flex-1 mx-4 max-w-sm rounded-md bg-ink-950/80 border border-bone-50/[0.06] px-3 py-1.5 font-mono text-[10px] text-bone-50/55 truncate flex items-center gap-2">
          <span className="text-emerald-400/70">●</span>
          panel.tricode.studio/{title.toLowerCase().replace(/\s+/g, '-')}
        </div>
        <div className="font-mono text-[10px] text-bone-50/40 hidden sm:block">⌘K</div>
      </div>

      <div className="grid grid-cols-12 min-h-[440px]">
        {/* Sidebar */}
        <aside className="col-span-4 sm:col-span-3 border-r border-bone-50/[0.06] bg-ink-950/50 p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-bone-50/35 px-2">
            Contenido
          </div>
          <motion.ul
            variants={stagger(0.07, 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-3 space-y-0.5"
          >
            {safeEntities.map((entity, index) => (
              <motion.li
                key={entity}
                variants={fadeUp}
                className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors ${
                  index === 0
                    ? 'bg-brand-purple/12 border border-brand-purple/25 text-bone-50'
                    : 'text-bone-50/55 hover:text-bone-50 hover:bg-bone-50/[0.03] cursor-pointer border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${index === 0 ? 'bg-brand-lavender' : 'bg-bone-50/30'}`} />
                  {entity}
                </span>
                <span className="font-mono text-[9px] text-bone-50/30">
                  {String(12 + index * 7).padStart(2, '0')}
                </span>
              </motion.li>
            ))}
          </motion.ul>
          <div className="mt-6 pt-4 border-t border-bone-50/[0.06]">
            <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-bone-50/35 px-2">
              Sistema
            </div>
            <ul className="mt-2 space-y-0.5">
              <li className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-bone-50/40">
                <span className="h-1 w-1 rounded-full bg-bone-50/25" />
                Usuarios
              </li>
              <li className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-bone-50/40">
                <span className="h-1 w-1 rounded-full bg-bone-50/25" />
                Ajustes
              </li>
            </ul>
          </div>
        </aside>

        {/* Main area */}
        <main className="col-span-8 sm:col-span-9 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-lavender/85">
                {subtitle}
              </div>
              <div className="mt-1.5 display-md text-xl sm:text-2xl text-bone-50">{title}</div>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center gap-2 rounded-full bg-bone-50 text-ink-950 px-4 py-2 text-[11px] font-medium hover:bg-brand-mist transition-colors"
            >
              <span className="text-base leading-none">+</span>
              Nuevo {safeEntities[0]?.slice(0, -1).toLowerCase() || 'item'}
            </motion.button>
          </div>

          {/* Metric */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.5, duration: 0.8, ease: EASE_OUT_EXPO }}
            className="mt-5 grid grid-cols-3 gap-3"
          >
            <div className="col-span-3 sm:col-span-1 rounded-xl border border-bone-50/[0.06] bg-bone-50/[0.02] p-4">
              <div className="text-[9px] font-mono uppercase tracking-[0.22em] text-bone-50/45">
                {metricLabel}
              </div>
              <div className="mt-2 display-md text-3xl text-bone-50">{metricValue}</div>
              <div className="mt-1.5 text-[10px] font-mono text-emerald-400/85 flex items-center gap-1.5">
                <span>↑</span> 12% vs. mes pasado
              </div>
            </div>
            <div className="col-span-3 sm:col-span-2 rounded-xl border border-bone-50/[0.06] bg-bone-50/[0.02] p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="text-[9px] font-mono uppercase tracking-[0.22em] text-bone-50/45">
                  Actividad · 30 días
                </div>
                <div className="font-mono text-[10px] text-emerald-400/85 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  en vivo
                </div>
              </div>
              <div className="mt-3 flex items-end gap-[3px] h-14">
                {[28, 42, 18, 56, 70, 38, 64, 48, 80, 52, 66, 72, 58, 84, 62].map((h, i) => (
                  <motion.span
                    key={i}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={viewportOnce}
                    transition={{ delay: 0.7 + i * 0.035, duration: 0.55, ease: EASE_OUT_EXPO }}
                    className="origin-bottom flex-1 rounded-sm bg-gradient-to-t from-brand-purple/70 to-brand-lavender/60"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form preview */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.7, duration: 0.8, ease: EASE_OUT_EXPO }}
            className="mt-3 rounded-xl border border-bone-50/[0.06] bg-bone-50/[0.015] p-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs text-bone-50/75 flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-bone-50/40">Editando</span>
                · Caso destacado
              </div>
              <div className="text-[10px] font-mono text-emerald-400/85 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-400" /> auto-guardado
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-20 text-[10px] font-mono uppercase tracking-[0.18em] text-bone-50/40">Título</span>
                <motion.div
                  initial={{ width: '60%' }}
                  whileInView={{ width: '100%' }}
                  viewport={viewportOnce}
                  transition={{ delay: 0.9, duration: 0.9, ease: EASE_OUT_EXPO }}
                  className="flex-1 rounded-md bg-ink-950/60 border border-brand-purple/30 px-3 py-2 text-xs text-bone-50 font-sans relative overflow-hidden"
                >
                  Sistema de reservas para clínicas dermatológicas
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-px bg-brand-lavender animate-pulse" />
                </motion.div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-[10px] font-mono uppercase tracking-[0.18em] text-bone-50/40">Tag</span>
                <div className="flex-1 rounded-md bg-ink-950/60 border border-bone-50/[0.06] px-3 py-2 text-xs text-bone-50/60 font-sans">
                  Salud · Reservas
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-[10px] font-mono uppercase tracking-[0.18em] text-bone-50/40">Estado</span>
                <div className="flex-1 rounded-md bg-ink-950/60 border border-bone-50/[0.06] px-3 py-2 text-xs text-bone-50/60 font-sans flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Publicado
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
}

export default function Cms() {
  const { config } = useLandingData();
  const sectionLabel = trimmed(config.cms?.sectionLabel);
  const titleTop = trimmed(config.cms?.titleTop);
  const titleHighlight = trimmed(config.cms?.titleHighlight);
  const description = trimmed(config.cms?.description);
  const features = Array.isArray(config.cms?.features)
    ? config.cms.features
        .map((item) => ({
          icon: trimmed(item?.icon),
          title: trimmed(item?.title),
          desc: trimmed(item?.desc),
        }))
        .filter((item) => item.title && item.desc)
    : [];
  const panelTitle = trimmed(config.cms?.panelTitle) || 'Tu CMS · Demo';
  const panelSubtitle = trimmed(config.cms?.panelSubtitle) || 'Panel de control';
  const panelMetricLabel =
    trimmed(config.cms?.panelMetricLabel) || 'Cambios publicados este mes';
  const panelMetricValue = trimmed(config.cms?.panelMetricValue) || '128';
  const panelEntities = Array.isArray(config.cms?.panelEntities)
    ? config.cms.panelEntities.map((entity) => trimmed(entity)).filter(Boolean)
    : [];
  const primaryCtaLabel = trimmed(config.cms?.primaryCtaLabel);
  const primaryCtaHref = trimmed(config.cms?.primaryCtaHref);
  const secondaryCtaLabel = trimmed(config.cms?.secondaryCtaLabel);
  const secondaryCtaHref = trimmed(config.cms?.secondaryCtaHref);

  return (
    <section
      id="cms"
      className="relative py-28 md:py-40 border-t border-white/5 overflow-hidden"
    >
      <div className="absolute -top-32 right-1/4 h-[420px] w-[420px] rounded-full bg-brand-violet/10 blur-[160px]" />
      <div className="absolute bottom-1/4 -left-32 h-[380px] w-[380px] rounded-full bg-brand-indigo/10 blur-[140px]" />
      <div className="absolute inset-0 grid-bg-soft opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />

      <div className="container-wide relative">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 items-center">
          <div className="col-span-12 lg:col-span-5">
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

            {(titleTop || titleHighlight) ? (
              <h2 className="display-xl text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
                {titleTop ? <SplitText as="span" text={titleTop} className="block text-white" /> : null}
                {titleHighlight ? (
                  <SplitText
                    as="span"
                    text={titleHighlight}
                    className="block mt-1"
                    wordClassName="italic-serif text-grad"
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

            {primaryCtaLabel && primaryCtaHref ? (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.45 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <MagneticButton
                  href={primaryCtaHref}
                  strength={0.3}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-bone-50 text-ink-950 px-7 py-4 text-sm font-medium hover:bg-brand-mist transition-colors"
                >
                  <span>{primaryCtaLabel}</span>
                  <span
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </MagneticButton>
                {secondaryCtaLabel && secondaryCtaHref ? (
                  <a
                    href={secondaryCtaHref}
                    className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-[0.18em] text-white/70 hover:text-white transition-colors"
                  >
                    <span className="link-reveal">{secondaryCtaLabel}</span>
                    <span aria-hidden>↗</span>
                  </a>
                ) : null}
              </motion.div>
            ) : null}
          </div>

          <div className="col-span-12 lg:col-span-7 lg:pl-8">
            <CmsPanel
              title={panelTitle}
              subtitle={panelSubtitle}
              metricLabel={panelMetricLabel}
              metricValue={panelMetricValue}
              entities={panelEntities}
            />
          </div>
        </div>

        {/* Features grid */}
        {features.length ? (
          <motion.div
            variants={stagger(0.08, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-24 md:mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] p-6 transition-all duration-500 hover:border-brand-purple/40 hover:bg-white/[0.045] hover:-translate-y-1"
              >
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand-violet/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl text-brand-purple">{feature.icon || '◆'}</span>
                    <span className="font-mono text-[10px] text-white/35">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 font-semibold text-white text-base">{feature.title}</h3>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

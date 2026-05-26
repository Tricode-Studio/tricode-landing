import { motion } from 'framer-motion';
import SplitText from './SplitText';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from '../lib/motion';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

type RoleKind = 'backend' | 'fullstack' | 'product' | 'frontend' | 'general';

function normalizeMemberRole(name: string, role: string) {
  const normalizedName = name.toLowerCase();
  if (normalizedName.includes('diego barrera')) return 'Desarrollador backend';
  if (normalizedName.includes('lautaro deccia')) return 'Desarrollador full stack';
  if (normalizedName.includes('juan diego elissalde')) {
    return role || 'Desarrollador full stack y producto';
  }
  return role;
}

function getRoleKind(role: string): RoleKind {
  const normalized = role.toLowerCase();
  if (normalized.includes('producto')) return 'product';
  if (normalized.includes('full stack') || normalized.includes('fullstack')) return 'fullstack';
  if (normalized.includes('backend')) return 'backend';
  if (normalized.includes('frontend') || normalized.includes('ui')) return 'frontend';
  return 'general';
}

function focusAreas(role: string, index: number) {
  const normalized = role.toLowerCase();
  if (normalized.includes('full stack') || normalized.includes('fullstack')) {
    return ['Frontend', 'Backend', 'Integraciones'];
  }
  if (normalized.includes('frontend') || normalized.includes('ui')) {
    return ['Interfaces', 'Rendimiento', 'Accesibilidad'];
  }
  if (normalized.includes('producto')) {
    return ['Estrategia', 'Ejecución', 'Negocio'];
  }
  if (normalized.includes('backend') || normalized.includes('stack')) {
    return ['Arquitectura', 'APIs', 'Escalabilidad'];
  }
  const fallback = [
    ['Arquitectura', 'Calidad', 'Entrega'],
    ['Experiencia', 'Producto', 'Impacto'],
    ['Tecnología', 'Procesos', 'Resultados'],
  ];
  return fallback[index % fallback.length];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

const ROLE_GRADIENTS: Record<RoleKind, string> = {
  backend: 'from-indigo-500/60 via-purple-500/40 to-violet-500/60',
  fullstack: 'from-violet-500/60 via-fuchsia-500/40 to-pink-500/50',
  product: 'from-cyan-400/50 via-blue-500/40 to-indigo-500/60',
  frontend: 'from-pink-400/50 via-violet-500/50 to-indigo-500/50',
  general: 'from-purple-500/55 via-violet-500/45 to-indigo-500/55',
};

export default function Team() {
  const { config } = useLandingData();
  const teamBlock = (Array.isArray(config.team)
    ? { members: config.team }
    : config.team ?? {}) as {
    sectionLabel?: string;
    titleTop?: string;
    titleHighlight?: string;
    description?: string;
    members?: Array<{ seed: string; name: string; role: string; bio: string }>;
  };
  const sectionLabel = trimmed(teamBlock.sectionLabel);
  const titleTop = trimmed(teamBlock.titleTop);
  const titleHighlight = trimmed(teamBlock.titleHighlight);
  const description = trimmed(teamBlock.description);
  const team = Array.isArray(teamBlock.members)
    ? teamBlock.members
        .map((member, index) => ({
          seed: trimmed(member?.seed) || trimmed(member?.name) || `member-${index + 1}`,
          name: trimmed(member?.name),
          role: normalizeMemberRole(trimmed(member?.name), trimmed(member?.role)),
          bio: trimmed(member?.bio),
        }))
        .filter((member) => member.name)
    : [];

  return (
    <section
      id="equipo"
      className="relative py-28 md:py-40 border-t border-white/5 overflow-hidden"
    >
      <img
        src="/fondo-idea.webp"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/85 to-ink-950" />
      <div className="absolute inset-0 grid-bg-soft opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />

      <div className="container-wide relative">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-end mb-16 md:mb-24">
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
            {(titleTop || titleHighlight) ? (
              <h2 className="display-xl text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[5.5rem]">
                {titleTop ? <SplitText as="span" text={titleTop} className="block text-white" /> : null}
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
          </div>
          {description ? (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 }}
              className="col-span-12 lg:col-span-4 text-white/65 leading-relaxed text-base md:text-lg"
            >
              {description}
            </motion.p>
          ) : null}
        </div>

        {team.length ? (
          <motion.div
            variants={stagger(0.1, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 md:auto-rows-fr"
          >
            {team.map((member, index) => {
              const kind = getRoleKind(member.role);
              return (
                <motion.article
                  key={member.name}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-950/70 backdrop-blur-md p-7 md:p-8 flex flex-col h-full"
                >
                  {/* Animated gradient layer on hover */}
                  <div
                    className={`pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br ${ROLE_GRADIENTS[kind]} blur-2xl`}
                  />

                  <div className="relative flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
                      Perfil {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/85 flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                      Core
                    </span>
                  </div>

                  {/* Avatar with initials over gradient */}
                  <div className="relative mt-7 mx-auto h-28 w-28 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${ROLE_GRADIENTS[kind]} opacity-90`}
                    />
                    <div className="absolute inset-0 grid-bg-soft opacity-30" />
                    <div className="relative h-full w-full flex items-center justify-center display-md text-3xl text-white/95">
                      {getInitials(member.name)}
                    </div>
                    <span className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-white/40 transition-all" />
                  </div>

                  <div className="relative mt-6 text-center">
                    <h3 className="display-md text-2xl md:text-3xl text-white">
                      {member.name}
                    </h3>
                    {member.role ? (
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-purple/85">
                        {member.role}
                      </p>
                    ) : null}
                  </div>

                  {member.bio ? (
                    <p className="relative mt-5 text-sm text-white/65 leading-relaxed text-center">
                      {member.bio}
                    </p>
                  ) : null}

                  <div className="relative mt-auto pt-7 flex flex-wrap justify-center gap-2">
                    {focusAreas(member.role, index).map((item) => (
                      <span
                        key={`${member.name}-${item}`}
                        className="rounded-full border border-white/14 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/70"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

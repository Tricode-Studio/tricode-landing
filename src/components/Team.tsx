import Spotlight from './Spotlight';
import { useLandingData } from '../content/LandingDataContext';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

type RoleKind = 'backend' | 'fullstack' | 'product' | 'frontend' | 'general';

function normalizeMemberRole(name: string, role: string) {
  const normalizedName = name.toLowerCase();
  if (normalizedName.includes('diego barrera')) {
    return 'Desarrollador backend';
  }
  if (normalizedName.includes('lautaro deccia')) {
    return 'Desarrollador full stack';
  }
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

function RoleIcon({ kind }: { kind: RoleKind }) {
  if (kind === 'backend') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <ellipse cx="12" cy="5.5" rx="7" ry="3.5" />
        <path d="M5 5.5v6c0 1.9 3.1 3.5 7 3.5s7-1.6 7-3.5v-6" />
        <path d="M5 11.5v6c0 1.9 3.1 3.5 7 3.5s7-1.6 7-3.5v-6" />
      </svg>
    );
  }
  if (kind === 'fullstack') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3.5" y="4" width="17" height="7" rx="1.5" />
        <rect x="3.5" y="13" width="17" height="7" rx="1.5" />
        <path d="M8 7.5h.01M8 16.5h.01M11 7.5h6M11 16.5h6" />
      </svg>
    );
  }
  if (kind === 'product') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1.3" fill="currentColor" />
      </svg>
    );
  }
  if (kind === 'frontend') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3.5" y="4" width="17" height="16" rx="2" />
        <path d="M7 9h10M7 13h6M7 17h4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 3v18M3 12h18" />
    </svg>
  );
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
  const team =
    Array.isArray(teamBlock.members)
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
    <section id="equipo" className="relative py-24 md:py-32 border-t border-white/5 overflow-hidden">
      <img
        src="/fondo-idea.webp"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-transparent to-ink-950" />

      <div className="container-x relative">
        {sectionLabel ? <div className="label mb-4 reveal">{sectionLabel}</div> : null}
        {(titleTop || titleHighlight) ? (
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-3xl reveal reveal-delay-1">
            {titleTop}
            {titleHighlight ? (
              <>
                <br />
                <span className="text-grad">{titleHighlight}</span>
              </>
            ) : null}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-5 text-white/60 max-w-2xl reveal reveal-delay-2">{description}</p>
        ) : null}

        {team.length ? (
          <div className="mt-14 grid md:grid-cols-3 md:auto-rows-fr gap-5">
            {team.map((member, index) => (
              <div key={`${member.name}-${index}`} className="reveal h-full" style={{ transitionDelay: `${index * 100}ms` }}>
                <Spotlight as="article" className="card card-hover rounded-2xl p-7 md:p-8 group border border-white/10 bg-ink-950/60 h-full flex flex-col">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[11px] tracking-[0.22em] text-white/45">
                      PERFIL {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-300">
                      Equipo core
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">
                    {member.name}
                  </h3>
                  {member.role ? (
                    <div className="mt-2 flex items-center gap-2 text-brand-purple/80">
                      <RoleIcon kind={getRoleKind(member.role)} />
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em]">
                        {member.role}
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-5 h-px bg-gradient-to-r from-brand-purple/55 via-white/10 to-transparent" />

                  {member.bio ? (
                    <p className="mt-5 text-sm leading-relaxed text-white/62">
                      {member.bio}
                    </p>
                  ) : null}

                  <div className="mt-auto pt-6 flex flex-wrap gap-2">
                    {focusAreas(member.role, index).map((item) => (
                      <span
                        key={`${member.name}-${item}`}
                        className="rounded-md border border-white/14 bg-white/[0.03] px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-white/72"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </Spotlight>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

import type {
  LandingConfig,
  LandingSectionId,
  LandingSectionLayout,
} from '../content/LandingDataContext';

type SectionMeta = {
  id: LandingSectionId;
  defaultEnabled: boolean;
  defaultNavLabel?: string;
  defaultNavHref?: string;
};

const SECTION_META: SectionMeta[] = [
  { id: 'hero', defaultEnabled: true },
  { id: 'about', defaultEnabled: true, defaultNavLabel: 'Nosotros', defaultNavHref: '#nosotros' },
  { id: 'services', defaultEnabled: true, defaultNavLabel: 'Servicios', defaultNavHref: '#servicios' },
  { id: 'projects', defaultEnabled: true, defaultNavLabel: 'Proyectos', defaultNavHref: '#proyectos' },
  { id: 'faq', defaultEnabled: true, defaultNavLabel: 'Preguntas', defaultNavHref: '#faq' },
  { id: 'process', defaultEnabled: true },
  { id: 'team', defaultEnabled: true, defaultNavLabel: 'Equipo', defaultNavHref: '#equipo' },
  { id: 'contact', defaultEnabled: true, defaultNavLabel: 'Contacto', defaultNavHref: '#contacto' },
  { id: 'stats', defaultEnabled: true },
];

export const DEFAULT_SECTION_LAYOUT: LandingSectionLayout[] = SECTION_META.map((section) => ({
  id: section.id,
  enabled: section.defaultEnabled,
  navLabel: section.defaultNavLabel,
  navHref: section.defaultNavHref,
}));

function isSectionId(value: unknown): value is LandingSectionId {
  return SECTION_META.some((section) => section.id === value);
}

function toTrimmedString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isDeprecatedPricingLink(link: { href: string; label: string }) {
  const href = link.href.toLowerCase();
  const label = link.label.toLowerCase();
  return href.includes('#pricing') || label.includes('pricing') || label.includes('plan');
}

export function normalizeSectionLayout(config: LandingConfig): LandingSectionLayout[] {
  const source = Array.isArray(config.layout?.sections) ? config.layout.sections : [];
  const sourceById = new Map<LandingSectionId, LandingSectionLayout>();

  for (const rawSection of source) {
    if (!rawSection || !isSectionId(rawSection.id) || sourceById.has(rawSection.id)) {
      continue;
    }
    sourceById.set(rawSection.id, rawSection);
  }

  return DEFAULT_SECTION_LAYOUT.map((defaultSection) => {
    const overrides = sourceById.get(defaultSection.id);
    return {
      id: defaultSection.id,
      enabled:
        typeof overrides?.enabled === 'boolean'
          ? overrides.enabled
          : defaultSection.enabled,
      navLabel: toTrimmedString(overrides?.navLabel) || defaultSection.navLabel,
      navHref: toTrimmedString(overrides?.navHref) || defaultSection.navHref,
    };
  });
}

export function resolveEnabledSectionOrder(config: LandingConfig): LandingSectionId[] {
  return normalizeSectionLayout(config)
    .filter((section) => section.enabled !== false)
    .map((section) => section.id);
}

export function resolveNavLinksFromLayout(config: LandingConfig) {
  const explicitLinks = config.nav?.links
    ?.map((link) => ({
      href: toTrimmedString(link?.href),
      label: toTrimmedString(link?.label),
    }))
    .filter((link): link is { href: string; label: string } => Boolean(link.href && link.label))
    .filter((link) => !isDeprecatedPricingLink(link));

  if (explicitLinks && explicitLinks.length) {
    return explicitLinks;
  }

  return normalizeSectionLayout(config)
    .filter((section) => section.enabled !== false)
    .filter((section) => section.navLabel && section.navHref)
    .map((section) => ({
      href: section.navHref as string,
      label: section.navLabel as string,
    }));
}

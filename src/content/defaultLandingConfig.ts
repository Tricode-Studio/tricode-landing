import type {
  LandingCmsFeature,
  LandingConfig,
  LandingSectionId,
  LandingSectionLayout,
  LandingService,
  LandingStep,
  LandingTeamMember,
} from './LandingDataContext';

type ServicesBlock = {
  sectionLabel?: string;
  titleTop?: string;
  titleHighlight?: string;
  description?: string;
  items?: LandingService[];
};

type TeamBlock = {
  sectionLabel?: string;
  titleTop?: string;
  titleHighlight?: string;
  description?: string;
  members?: LandingTeamMember[];
};

type SectionMeta = {
  id: LandingSectionId;
  navLabel?: string;
  navHref?: string;
};

const SECTION_META: SectionMeta[] = [
  { id: 'hero' },
  { id: 'about', navLabel: 'Nosotros', navHref: '#nosotros' },
  { id: 'services', navLabel: 'Servicios', navHref: '#servicios' },
  { id: 'cms', navLabel: 'CMS', navHref: '#cms' },
  { id: 'projects', navLabel: 'Proyectos', navHref: '#proyectos' },
  { id: 'faq', navLabel: 'Preguntas', navHref: '#faq' },
  { id: 'process' },
  { id: 'team' },
  { id: 'contact', navLabel: 'Contacto', navHref: '#contacto' },
  { id: 'stats' },
];

const DEFAULT_LAYOUT_SECTIONS: LandingSectionLayout[] = SECTION_META.map((section) => ({
  id: section.id,
  enabled: true,
  navLabel: section.navLabel,
  navHref: section.navHref,
}));

const DEFAULT_SERVICES: LandingService[] = [
  {
    title: 'Páginas de aterrizaje',
    desc: 'Landing pages pensadas para convertir tráfico en consultas reales, con estructura clara, velocidad alta y medición de conversiones.',
    tag: 'Alta conversión',
    audience: 'Ideal para empresas de servicios, campañas puntuales y lanzamientos que necesitan resultados rápidos.',
  },
  {
    title: 'Comercio electrónico',
    desc: 'Tiendas online con catálogo optimizado, checkout simple, pagos integrados y panel de administración para gestionar ventas sin fricción.',
    tag: 'Ventas automatizadas',
    audience: 'Ideal para marcas que quieren vender 24/7 con una operación más ordenada.',
  },
  {
    title: 'Sistemas de Reservas',
    desc: 'Sistemas de turnos y reservas con confirmaciones automáticas, disponibilidad en tiempo real y mejor experiencia para el cliente final.',
    tag: 'Más eficiencia',
    audience: 'Ideal para clínicas, consultorios, estudios y servicios con agenda.',
  },
  {
    title: 'Soluciones Personalizadas',
    desc: 'Desarrollamos software a medida para procesos específicos: ventas, seguimiento, operación interna e integraciones con otras plataformas.',
    tag: 'Sin límites',
    audience: 'Ideal para empresas que ya crecieron y necesitan una solución propia.',
  },
];

const DEFAULT_TEAM: LandingTeamMember[] = [
  {
    seed: 'diego-barrera-tricode',
    name: 'Diego Barrera',
    role: 'Desarrollador backend',
    bio: 'Arquitectura backend, APIs y escalabilidad.',
  },
  {
    seed: 'lautaro-deccia-tricode',
    name: 'Lautaro Deccia',
    role: 'Desarrollador full stack',
    bio: 'Experiencias web, diseño de interfaces y rendimiento.',
  },
  {
    seed: 'juan-diego-elissalde-tricode',
    name: 'Juan Diego Elissalde',
    role: 'Desarrollador full stack y producto',
    bio: 'Producto, ejecución técnica y enfoque en negocio.',
  },
];

const DEFAULT_CMS_FEATURES: LandingCmsFeature[] = [
  {
    icon: '◐',
    title: 'Autogestión total',
    desc: 'Editás textos, imágenes, productos, proyectos o reservas sin escribir una línea de código y sin pedirnos cambios.',
  },
  {
    icon: '◑',
    title: 'Interfaz hecha para personas',
    desc: 'Pensado para no-técnicos: campos claros, vistas previas en vivo y guardado seguro. Si sabés usar Instagram, lo vas a manejar.',
  },
  {
    icon: '◒',
    title: 'Adaptado a tu negocio',
    desc: 'Cada CMS se modela según tus entidades reales: catálogo, citas, casos, equipo. No hay campos sobrantes ni atajos genéricos.',
  },
  {
    icon: '◓',
    title: 'Cambios al instante',
    desc: 'Lo que actualizás aparece publicado en segundos. Sin recompilar, sin esperar a un desarrollador, sin riesgo de romper nada.',
  },
];

const DEFAULT_STEPS: LandingStep[] = [
  { n: '01', title: 'Idea', desc: 'Entendemos tu negocio, contexto y objetivo.' },
  { n: '02', title: 'Diseño', desc: 'Definimos estructura, experiencia y propuesta visual.' },
  { n: '03', title: 'Desarrollo', desc: 'Construimos con entregas iterativas y feedback continuo.' },
  { n: '04', title: 'Lanzamiento', desc: 'Publicamos y dejamos todo operativo y medible.' },
  { n: '05', title: 'Evolución', desc: 'Mejoramos producto, conversión y crecimiento.' },
];

function cleanString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const normalized = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);

  return normalized.length ? normalized : fallback;
}

function cleanLayoutSections(value: unknown) {
  const source = Array.isArray(value) ? value : [];
  const seen = new Set<LandingSectionId>();
  const normalized: LandingSectionLayout[] = [];

  for (const rawSection of source) {
    if (!rawSection || typeof rawSection !== 'object') {
      continue;
    }

    const section = rawSection as LandingSectionLayout;
    const sectionId = section.id;
    if (!sectionId || !SECTION_META.some((item) => item.id === sectionId) || seen.has(sectionId)) {
      continue;
    }

    seen.add(sectionId);
    const defaults = SECTION_META.find((item) => item.id === sectionId);
    normalized.push({
      id: sectionId,
      enabled: typeof section.enabled === 'boolean' ? section.enabled : true,
      navLabel: cleanString(section.navLabel) || defaults?.navLabel,
      navHref: cleanString(section.navHref) || defaults?.navHref,
    });
  }

  for (const defaults of DEFAULT_LAYOUT_SECTIONS) {
    if (seen.has(defaults.id)) {
      continue;
    }
    normalized.push({ ...defaults });
  }

  return normalized;
}

function isDeprecatedPricingLink(link: { href: string; label: string }) {
  const href = cleanString(link.href).toLowerCase();
  const label = cleanString(link.label).toLowerCase();
  return href.includes('#pricing') || label.includes('pricing') || label.includes('plan');
}

function normalizeBusinessLocation(value: string) {
  const normalized = cleanString(value);
  if (!normalized) return 'Trinidad, Flores, Uruguay';
  if (/montevideo/i.test(normalized)) return 'Trinidad, Flores, Uruguay';
  return normalized;
}

function normalizeFoundationMicroStats(
  items: Array<{ k: string; v: string }> | undefined,
) {
  if (!items) return items;
  return items.map((item) => {
    if (/fundaci/i.test(item.v) && item.k === '2024') {
      return { ...item, k: '2023' };
    }
    return item;
  });
}

function renumberSectionLabel(value: string, order: number) {
  const trimmed = cleanString(value);
  if (!trimmed) {
    return trimmed;
  }

  const nextNumber = String(order).padStart(2, '0');
  if (/^\/\/\s*\d+\s*-\s*/.test(trimmed)) {
    return trimmed.replace(/^\/\/\s*\d+\s*-\s*/, `// ${nextNumber} - `);
  }

  return trimmed;
}

function applySequentialSectionLabels(config: LandingConfig): LandingConfig {
  const orderedSections =
    (config.layout?.sections ?? [])
      .filter((section) => section.enabled !== false)
      .map((section) => section.id)
      .filter(
        (sectionId): sectionId is LandingSectionId =>
          sectionId !== 'hero' && sectionId !== 'stats',
      ) ?? [];

  const indexBySection = new Map<LandingSectionId, number>();
  orderedSections.forEach((sectionId, index) => {
    indexBySection.set(sectionId, index + 1);
  });

  return {
    ...config,
    about: {
      ...config.about,
      sectionLabel: renumberSectionLabel(
        config.about?.sectionLabel ?? '',
        indexBySection.get('about') ?? 1,
      ),
    },
    services: Array.isArray(config.services)
      ? config.services
      : {
          ...config.services,
          sectionLabel: renumberSectionLabel(
            config.services?.sectionLabel ?? '',
            indexBySection.get('services') ?? 2,
          ),
        },
    cms: {
      ...config.cms,
      sectionLabel: renumberSectionLabel(
        config.cms?.sectionLabel ?? '',
        indexBySection.get('cms') ?? 3,
      ),
    },
    projects: {
      ...config.projects,
      sectionLabel: renumberSectionLabel(
        config.projects?.sectionLabel ?? '',
        indexBySection.get('projects') ?? 4,
      ),
    },
    faq: {
      ...config.faq,
      sectionLabel: renumberSectionLabel(
        config.faq?.sectionLabel ?? '',
        indexBySection.get('faq') ?? 4,
      ),
    },
    process: {
      ...config.process,
      sectionLabel: renumberSectionLabel(
        config.process?.sectionLabel ?? '',
        indexBySection.get('process') ?? 5,
      ),
    },
    team: Array.isArray(config.team)
      ? config.team
      : {
          ...config.team,
          sectionLabel: renumberSectionLabel(
            config.team?.sectionLabel ?? '',
            indexBySection.get('team') ?? 6,
          ),
        },
    contact: {
      ...config.contact,
      sectionLabel: renumberSectionLabel(
        config.contact?.sectionLabel ?? '',
        indexBySection.get('contact') ?? 7,
      ),
    },
  };
}

export const DEFAULT_LANDING_CONFIG: LandingConfig = {
  brandName: 'Tricode Studio',
  layout: {
    sections: DEFAULT_LAYOUT_SECTIONS,
  },
  nav: {
    links: DEFAULT_LAYOUT_SECTIONS
      .filter((section) => section.navHref && section.navLabel)
      .map((section) => ({ href: section.navHref as string, label: section.navLabel as string })),
    ctaLabel: 'Hablemos',
    ctaHref: '#contacto',
  },
  hero: {
    rotatingWords: ['ideas', 'productos', 'marcas', 'experiencias'],
    titlePrefix: 'Transformamos',
    titleSuffix: 'en soluciones digitales.',
    description:
      'En Tricode Studio diseñamos y desarrollamos productos web a medida desde la idea hasta el lanzamiento.',
    primaryCtaLabel: 'Empezar un proyecto',
    primaryCtaHref: '#contacto',
    secondaryCtaLabel: 'Ver servicios',
    secondaryCtaHref: '#servicios',
    statusLabel: 'estado: en línea',
    techStack: ['React', 'Next.js', 'Node', 'TypeScript', 'PostgreSQL', 'Docker'],
    backgroundImage: '/hero.webp',
  },
  stats: [
    { value: 3, suffix: 'x', label: 'Más potencia que un freelancer solo' },
    { value: 100, suffix: '%', label: 'Proyectos entregados a tiempo' },
    { value: 24, suffix: 'h', label: 'Tiempo de respuesta promedio' },
    { value: 15, prefix: '+', label: 'Proyectos en producción' },
  ],
  about: {
    sectionLabel: '// 01 - Sobre nosotros',
    titleTop: 'Empezamos como tres amigos',
    titleHighlight: 'con la misma obsesión por construir.',
    description:
      'Tricode nació en 2023 en Trinidad, Flores, cuando entendimos que la mayoría de empresas no necesitaba "una web más", sino una herramienta que les diera autonomía real. Hoy somos un estudio compacto de producto, diseño y desarrollo enfocado en construir software que se mantenga útil con el tiempo.',
    microStats: [
      { k: '2023', v: 'Año de fundación' },
      { k: 'Trinidad, Flores', v: 'Base en Uruguay' },
      { k: '3', v: 'Especialistas core' },
    ],
    pillars: [
      {
        icon: '◆',
        title: 'Orientación a resultados',
        desc: 'Cada entrega tiene una meta concreta: vender más, ahorrar tiempo o mejorar conversión.',
      },
      {
        icon: '◇',
        title: 'Arquitectura mantenible',
        desc: 'Construimos para crecer sin rehacer todo a los 6 meses: código claro, modular y documentado.',
      },
      {
        icon: '◈',
        title: 'Diseño con criterio',
        desc: 'No hacemos pantallas lindas sin propósito: priorizamos claridad, usabilidad y rendimiento.',
      },
      {
        icon: '◉',
        title: 'Acompañamiento real',
        desc: 'No desaparecemos al publicar: medimos, ajustamos y evolucionamos junto a tu equipo.',
      },
    ],
    quote: {
      text: 'Cada línea de código que escribimos es una inversión en crecimiento.',
      highlight: 'No buscamos clientes, buscamos socios.',
    },
  },
  services: {
    sectionLabel: '// 02 - Servicios',
    titleTop: '¿Qué podemos',
    titleHighlight: 'construir para vos?',
    description:
      'Cada servicio está enfocado en impacto real: captación comercial, eficiencia operativa y crecimiento sostenible.',
    items: DEFAULT_SERVICES,
  },
  team: {
    sectionLabel: '// 05 - Equipo',
    titleTop: 'Las personas detrás',
    titleHighlight: 'del código.',
    description: 'Amigos antes que colegas. Producto y tecnología, lado a lado.',
    members: DEFAULT_TEAM,
  },
  process: {
    sectionLabel: '// 04 - Proceso',
    titleTop: 'De la idea al producto',
    titleHighlight: 'en 5 pasos.',
    description: 'Un proceso claro y transparente para avanzar con foco.',
    steps: DEFAULT_STEPS,
  },
  cms: {
    sectionLabel: '// 03 - CMS',
    titleTop: 'Tu propio panel para',
    titleHighlight: 'gestionar todo, sin depender de nadie.',
    description:
      'Cada proyecto que entregamos viene con un CMS hecho a medida. Editás contenido, productos, reservas o casos cuando vos quieras, desde una interfaz pensada para que cualquier persona del equipo pueda usarla.',
    features: DEFAULT_CMS_FEATURES,
    panelTitle: 'Tu CMS · Demo',
    panelSubtitle: 'Panel de control',
    panelMetricLabel: 'Cambios publicados este mes',
    panelMetricValue: '128',
    panelEntities: ['Proyectos', 'Servicios', 'Equipo', 'FAQs', 'Hero', 'Footer'],
    primaryCtaLabel: 'Ver una demo en vivo',
    primaryCtaHref: '#contacto',
    secondaryCtaLabel: 'Cómo funciona',
    secondaryCtaHref: '#proceso',
  },
  projects: {
    sectionLabel: '// 03 - Proyectos',
    title: 'Lo que somos capaces',
    titleHighlight: 'de construir.',
    description: 'Una selección de proyectos donde aplicamos diseño, código y producto.',
    viewAllLabel: 'Ver todos los proyectos',
    viewAllHref: '/proyectos',
    featuredLimit: 6,
    cardCtaLabel: 'Ver proyecto',
    emptyStateLabel: 'Todavía no hay proyectos publicados.',
    pageLabel: '// proyectos',
    backToHomeLabel: 'Volver al inicio',
    backToHomeHref: '/',
    pageTitle: 'Proyectos de Tricode: ideas convertidas en producto digital.',
    pageDescription: 'Desde landings hasta sistemas de reservas y tiendas online.',
    pageFilters: ['Todos', 'Reservas', 'E-commerce', 'Marca', 'Salud', 'Turismo'],
    pageEmptyStateLabel: 'No hay proyectos cargados todavía.',
    nextStepLabel: '// siguiente paso',
    nextStepTitleTop: '¿Querés ser',
    nextStepTitleHighlight: 'el próximo?',
    pageCtaLabel: 'Empezar un proyecto',
    pageCtaHref: '/brief',
  },
  faq: {
    sectionLabel: '// 06 - Preguntas frecuentes',
    titleTop: 'Preguntas',
    titleHighlight: 'frecuentes',
    description: 'Respuestas rápidas para tomar decisión con claridad.',
    items: [
      {
        question: '¿Qué tipo de proyectos desarrolla Tricode?',
        answer:
          'Trabajamos en landings de alto rendimiento, e-commerce, sistemas de reservas y software a medida para operación interna. También resolvemos integraciones con herramientas externas y paneles de gestión para equipos comerciales y operativos.',
      },
      {
        question: '¿Cuánto demora un proyecto típico?',
        answer:
          'Depende del alcance y de la complejidad de negocio. Una landing suele demorar entre 2 y 4 semanas, mientras que un sistema a medida normalmente se trabaja entre 6 y 12 semanas con entregas parciales para validar rápido.',
      },
      {
        question: '¿Trabajan solo en Uruguay?',
        answer:
          'Nuestra base está en Trinidad, Flores (Uruguay), y trabajamos de forma remota con clientes de otras ciudades y de Latinoamérica, manteniendo reuniones y seguimiento continuo.',
      },
      {
        question: '¿Incluyen SEO y analítica?',
        answer:
          'Sí. Implementamos base técnica SEO (estructura, metadatos, sitemap, rendimiento) y analítica con GA4 para medir conversiones. Además dejamos el sitio listo para escalar campañas y contenido.',
      },
      {
        question: '¿Pueden integrar pagos y herramientas externas?',
        answer:
          'Sí. Integramos pasarelas de pago, calendarios, email marketing, CRM y herramientas operativas según el caso. Definimos la integración por flujo real de negocio, no por moda tecnológica.',
      },
      {
        question: '¿Qué diferencia a Tricode de otras opciones?',
        answer:
          'Combinamos producto, diseño y desarrollo en el mismo equipo, con foco en objetivos medibles. No entregamos solo “una web”: construimos una solución que se pueda mantener, optimizar y usar para crecer.',
      },
    ],
  },
  contact: {
    sectionLabel: '// 07 - Hablemos',
    titleTop: 'Tu próximo proyecto',
    titleHighlight: 'empieza con una charla.',
    description: 'Completá un cuestionario estratégico y te devolvemos una propuesta clara de alcance, tiempos y costo.',
    whatsappNumber: '091035868',
    whatsappText: '¡Hola Tricode! Quiero cotizar un proyecto.',
    email: 'hola@tricode.studio',
    primaryCtaLabel: 'Escribinos por WhatsApp',
    primaryCtaHref: '',
    secondaryCtaLabel: 'hola@tricode.studio',
    secondaryCtaHref: 'https://mail.google.com/mail/?view=cm&fs=1',
    emailSubject: 'Quiero cotizar un proyecto con Tricode',
    emailBody:
      '¡Hola Tricode! Quiero conversar sobre una landing, sistema o automatización para mi marca.',
    location: 'Trinidad, Flores, Uruguay',
  },
  footer: {
    socials: [
      { label: 'Instagram', url: 'https://instagram.com/tricode.studio' },
      { label: 'LinkedIn', url: 'https://linkedin.com' },
      { label: 'Email', url: 'mailto:hola@tricode.studio' },
    ],
    copyright: `© ${new Date().getFullYear()} Tricode Studio. Todos los derechos reservados.`,
  },
};

export function withLandingDefaults(rawConfig: LandingConfig | null | undefined): LandingConfig {
  const source = rawConfig ?? {};
  const servicesSource: ServicesBlock = Array.isArray(source.services)
    ? { items: source.services }
    : (source.services as ServicesBlock) ?? {};
  const teamSource: TeamBlock = Array.isArray(source.team)
    ? { members: source.team }
    : (source.team as TeamBlock) ?? {};
  const defaultServicesBlock: ServicesBlock = (DEFAULT_LANDING_CONFIG.services as ServicesBlock) ?? {};
  const defaultTeamBlock: TeamBlock = (DEFAULT_LANDING_CONFIG.team as TeamBlock) ?? {};

  const merged: LandingConfig = {
    ...DEFAULT_LANDING_CONFIG,
    ...source,
    brandName: cleanString(source.brandName) || DEFAULT_LANDING_CONFIG.brandName,
    layout: {
      ...DEFAULT_LANDING_CONFIG.layout,
      ...source.layout,
      sections: cleanLayoutSections(source.layout?.sections),
    },
    nav: {
      ...DEFAULT_LANDING_CONFIG.nav,
      ...source.nav,
      links:
        Array.isArray(source.nav?.links) && source.nav.links.length
          ? source.nav.links
              .map((link) => ({
                href: cleanString(link?.href),
                label: cleanString(link?.label),
              }))
              .filter((link) => link.href && link.label)
              .filter((link) => !isDeprecatedPricingLink(link))
          : DEFAULT_LANDING_CONFIG.nav?.links,
      ctaLabel: cleanString(source.nav?.ctaLabel) || DEFAULT_LANDING_CONFIG.nav?.ctaLabel,
      ctaHref: cleanString(source.nav?.ctaHref) || DEFAULT_LANDING_CONFIG.nav?.ctaHref,
    },
    hero: {
      ...DEFAULT_LANDING_CONFIG.hero,
      ...source.hero,
      titlePrefix: cleanString(source.hero?.titlePrefix) || DEFAULT_LANDING_CONFIG.hero?.titlePrefix,
      titleSuffix: cleanString(source.hero?.titleSuffix) || DEFAULT_LANDING_CONFIG.hero?.titleSuffix,
      description:
        cleanString(source.hero?.description) || DEFAULT_LANDING_CONFIG.hero?.description,
      primaryCtaLabel:
        cleanString(source.hero?.primaryCtaLabel) || DEFAULT_LANDING_CONFIG.hero?.primaryCtaLabel,
      primaryCtaHref:
        cleanString(source.hero?.primaryCtaHref) || DEFAULT_LANDING_CONFIG.hero?.primaryCtaHref,
      secondaryCtaLabel:
        cleanString(source.hero?.secondaryCtaLabel) || DEFAULT_LANDING_CONFIG.hero?.secondaryCtaLabel,
      secondaryCtaHref:
        cleanString(source.hero?.secondaryCtaHref) || DEFAULT_LANDING_CONFIG.hero?.secondaryCtaHref,
      statusLabel: cleanString(source.hero?.statusLabel) || DEFAULT_LANDING_CONFIG.hero?.statusLabel,
      rotatingWords: cleanStringArray(
        source.hero?.rotatingWords,
        DEFAULT_LANDING_CONFIG.hero?.rotatingWords ?? [],
      ),
      techStack: cleanStringArray(
        source.hero?.techStack,
        DEFAULT_LANDING_CONFIG.hero?.techStack ?? [],
      ),
      backgroundImage:
        cleanString(source.hero?.backgroundImage) || DEFAULT_LANDING_CONFIG.hero?.backgroundImage,
    },
    stats:
      Array.isArray(source.stats) && source.stats.length
        ? source.stats
        : DEFAULT_LANDING_CONFIG.stats,
    about: {
      ...DEFAULT_LANDING_CONFIG.about,
      ...source.about,
      sectionLabel:
        cleanString(source.about?.sectionLabel) || DEFAULT_LANDING_CONFIG.about?.sectionLabel,
      titleTop: cleanString(source.about?.titleTop) || DEFAULT_LANDING_CONFIG.about?.titleTop,
      titleHighlight:
        cleanString(source.about?.titleHighlight) || DEFAULT_LANDING_CONFIG.about?.titleHighlight,
      description:
        cleanString(source.about?.description) || DEFAULT_LANDING_CONFIG.about?.description,
      microStats:
        normalizeFoundationMicroStats(
          Array.isArray(source.about?.microStats) && source.about.microStats.length
            ? source.about.microStats
            : DEFAULT_LANDING_CONFIG.about?.microStats,
        ),
      pillars:
        Array.isArray(source.about?.pillars) && source.about.pillars.length
          ? source.about.pillars
          : DEFAULT_LANDING_CONFIG.about?.pillars,
      quote: {
        ...DEFAULT_LANDING_CONFIG.about?.quote,
        ...source.about?.quote,
        text: cleanString(source.about?.quote?.text) || DEFAULT_LANDING_CONFIG.about?.quote?.text,
        highlight:
          cleanString(source.about?.quote?.highlight) || DEFAULT_LANDING_CONFIG.about?.quote?.highlight,
      },
    },
    services: {
      ...defaultServicesBlock,
      ...servicesSource,
      sectionLabel:
        cleanString(servicesSource.sectionLabel) || defaultServicesBlock.sectionLabel,
      titleTop:
        cleanString(servicesSource.titleTop) || defaultServicesBlock.titleTop,
      titleHighlight:
        cleanString(servicesSource.titleHighlight) || defaultServicesBlock.titleHighlight,
      description:
        cleanString(servicesSource.description) || defaultServicesBlock.description,
      items:
        Array.isArray(servicesSource.items) && servicesSource.items.length
          ? servicesSource.items
          : defaultServicesBlock.items,
    },
    team: {
      ...defaultTeamBlock,
      ...teamSource,
      sectionLabel:
        cleanString(teamSource.sectionLabel) || defaultTeamBlock.sectionLabel,
      titleTop:
        cleanString(teamSource.titleTop) || defaultTeamBlock.titleTop,
      titleHighlight:
        cleanString(teamSource.titleHighlight) || defaultTeamBlock.titleHighlight,
      description:
        cleanString(teamSource.description) || defaultTeamBlock.description,
      members:
        Array.isArray(teamSource.members) && teamSource.members.length
          ? teamSource.members
          : defaultTeamBlock.members,
    },
    cms: {
      ...DEFAULT_LANDING_CONFIG.cms,
      ...source.cms,
      sectionLabel:
        cleanString(source.cms?.sectionLabel) || DEFAULT_LANDING_CONFIG.cms?.sectionLabel,
      titleTop: cleanString(source.cms?.titleTop) || DEFAULT_LANDING_CONFIG.cms?.titleTop,
      titleHighlight:
        cleanString(source.cms?.titleHighlight) || DEFAULT_LANDING_CONFIG.cms?.titleHighlight,
      description:
        cleanString(source.cms?.description) || DEFAULT_LANDING_CONFIG.cms?.description,
      features:
        Array.isArray(source.cms?.features) && source.cms.features.length
          ? source.cms.features
          : DEFAULT_LANDING_CONFIG.cms?.features,
      panelTitle:
        cleanString(source.cms?.panelTitle) || DEFAULT_LANDING_CONFIG.cms?.panelTitle,
      panelSubtitle:
        cleanString(source.cms?.panelSubtitle) || DEFAULT_LANDING_CONFIG.cms?.panelSubtitle,
      panelMetricLabel:
        cleanString(source.cms?.panelMetricLabel) ||
        DEFAULT_LANDING_CONFIG.cms?.panelMetricLabel,
      panelMetricValue:
        cleanString(source.cms?.panelMetricValue) ||
        DEFAULT_LANDING_CONFIG.cms?.panelMetricValue,
      panelEntities: cleanStringArray(
        source.cms?.panelEntities,
        DEFAULT_LANDING_CONFIG.cms?.panelEntities ?? [],
      ),
      primaryCtaLabel:
        cleanString(source.cms?.primaryCtaLabel) ||
        DEFAULT_LANDING_CONFIG.cms?.primaryCtaLabel,
      primaryCtaHref:
        cleanString(source.cms?.primaryCtaHref) ||
        DEFAULT_LANDING_CONFIG.cms?.primaryCtaHref,
      secondaryCtaLabel:
        cleanString(source.cms?.secondaryCtaLabel) ||
        DEFAULT_LANDING_CONFIG.cms?.secondaryCtaLabel,
      secondaryCtaHref:
        cleanString(source.cms?.secondaryCtaHref) ||
        DEFAULT_LANDING_CONFIG.cms?.secondaryCtaHref,
    },
    process: {
      ...DEFAULT_LANDING_CONFIG.process,
      ...source.process,
      sectionLabel:
        cleanString(source.process?.sectionLabel) || DEFAULT_LANDING_CONFIG.process?.sectionLabel,
      titleTop: cleanString(source.process?.titleTop) || DEFAULT_LANDING_CONFIG.process?.titleTop,
      titleHighlight:
        cleanString(source.process?.titleHighlight) || DEFAULT_LANDING_CONFIG.process?.titleHighlight,
      description:
        cleanString(source.process?.description) || DEFAULT_LANDING_CONFIG.process?.description,
      steps:
        Array.isArray(source.process?.steps) && source.process.steps.length
          ? source.process.steps
          : DEFAULT_LANDING_CONFIG.process?.steps,
    },
    projects: {
      ...DEFAULT_LANDING_CONFIG.projects,
      ...source.projects,
      sectionLabel:
        cleanString(source.projects?.sectionLabel) || DEFAULT_LANDING_CONFIG.projects?.sectionLabel,
      title: cleanString(source.projects?.title) || DEFAULT_LANDING_CONFIG.projects?.title,
      titleHighlight:
        cleanString(source.projects?.titleHighlight) || DEFAULT_LANDING_CONFIG.projects?.titleHighlight,
      description:
        cleanString(source.projects?.description) || DEFAULT_LANDING_CONFIG.projects?.description,
      viewAllLabel:
        cleanString(source.projects?.viewAllLabel) || DEFAULT_LANDING_CONFIG.projects?.viewAllLabel,
      viewAllHref:
        cleanString(source.projects?.viewAllHref) || DEFAULT_LANDING_CONFIG.projects?.viewAllHref,
      cardCtaLabel:
        cleanString(source.projects?.cardCtaLabel) || DEFAULT_LANDING_CONFIG.projects?.cardCtaLabel,
      emptyStateLabel:
        cleanString(source.projects?.emptyStateLabel) || DEFAULT_LANDING_CONFIG.projects?.emptyStateLabel,
      pageLabel:
        cleanString(source.projects?.pageLabel) || DEFAULT_LANDING_CONFIG.projects?.pageLabel,
      backToHomeLabel:
        cleanString(source.projects?.backToHomeLabel) || DEFAULT_LANDING_CONFIG.projects?.backToHomeLabel,
      backToHomeHref:
        cleanString(source.projects?.backToHomeHref) || DEFAULT_LANDING_CONFIG.projects?.backToHomeHref,
      pageTitle:
        cleanString(source.projects?.pageTitle) || DEFAULT_LANDING_CONFIG.projects?.pageTitle,
      pageDescription:
        cleanString(source.projects?.pageDescription) || DEFAULT_LANDING_CONFIG.projects?.pageDescription,
      pageFilters: cleanStringArray(
        source.projects?.pageFilters,
        DEFAULT_LANDING_CONFIG.projects?.pageFilters ?? [],
      ),
      pageEmptyStateLabel:
        cleanString(source.projects?.pageEmptyStateLabel) ||
        DEFAULT_LANDING_CONFIG.projects?.pageEmptyStateLabel,
      nextStepLabel:
        cleanString(source.projects?.nextStepLabel) || DEFAULT_LANDING_CONFIG.projects?.nextStepLabel,
      nextStepTitleTop:
        cleanString(source.projects?.nextStepTitleTop) || DEFAULT_LANDING_CONFIG.projects?.nextStepTitleTop,
      nextStepTitleHighlight:
        cleanString(source.projects?.nextStepTitleHighlight) ||
        DEFAULT_LANDING_CONFIG.projects?.nextStepTitleHighlight,
      pageCtaLabel:
        cleanString(source.projects?.pageCtaLabel) || DEFAULT_LANDING_CONFIG.projects?.pageCtaLabel,
      pageCtaHref:
        cleanString(source.projects?.pageCtaHref) || DEFAULT_LANDING_CONFIG.projects?.pageCtaHref,
    },
    faq: {
      ...DEFAULT_LANDING_CONFIG.faq,
      ...source.faq,
      sectionLabel: cleanString(source.faq?.sectionLabel) || DEFAULT_LANDING_CONFIG.faq?.sectionLabel,
      titleTop: cleanString(source.faq?.titleTop) || DEFAULT_LANDING_CONFIG.faq?.titleTop,
      titleHighlight:
        cleanString(source.faq?.titleHighlight) || DEFAULT_LANDING_CONFIG.faq?.titleHighlight,
      description: cleanString(source.faq?.description) || DEFAULT_LANDING_CONFIG.faq?.description,
      items:
        Array.isArray(source.faq?.items) && source.faq.items.length
          ? source.faq.items
              .map((item) => ({
                question: cleanString(item?.question),
                answer: cleanString(item?.answer),
              }))
              .filter((item) => item.question && item.answer)
          : DEFAULT_LANDING_CONFIG.faq?.items,
    },
    contact: {
      ...DEFAULT_LANDING_CONFIG.contact,
      ...source.contact,
      sectionLabel:
        cleanString(source.contact?.sectionLabel) || DEFAULT_LANDING_CONFIG.contact?.sectionLabel,
      titleTop: cleanString(source.contact?.titleTop) || DEFAULT_LANDING_CONFIG.contact?.titleTop,
      titleHighlight:
        cleanString(source.contact?.titleHighlight) || DEFAULT_LANDING_CONFIG.contact?.titleHighlight,
      description:
        cleanString(source.contact?.description) || DEFAULT_LANDING_CONFIG.contact?.description,
      whatsappNumber:
        cleanString(source.contact?.whatsappNumber) || DEFAULT_LANDING_CONFIG.contact?.whatsappNumber,
      whatsappText:
        cleanString(source.contact?.whatsappText) || DEFAULT_LANDING_CONFIG.contact?.whatsappText,
      email: cleanString(source.contact?.email) || DEFAULT_LANDING_CONFIG.contact?.email,
      location: normalizeBusinessLocation(
        cleanString(source.contact?.location) || DEFAULT_LANDING_CONFIG.contact?.location || '',
      ),
      primaryCtaLabel:
        cleanString(source.contact?.primaryCtaLabel) || DEFAULT_LANDING_CONFIG.contact?.primaryCtaLabel,
      secondaryCtaLabel:
        cleanString(source.contact?.secondaryCtaLabel) || DEFAULT_LANDING_CONFIG.contact?.secondaryCtaLabel,
      primaryCtaHref:
        cleanString(source.contact?.primaryCtaHref) || DEFAULT_LANDING_CONFIG.contact?.primaryCtaHref,
      secondaryCtaHref:
        cleanString(source.contact?.secondaryCtaHref) || DEFAULT_LANDING_CONFIG.contact?.secondaryCtaHref,
      emailSubject:
        cleanString(source.contact?.emailSubject) || DEFAULT_LANDING_CONFIG.contact?.emailSubject,
      emailBody: cleanString(source.contact?.emailBody) || DEFAULT_LANDING_CONFIG.contact?.emailBody,
    },
    footer: {
      ...DEFAULT_LANDING_CONFIG.footer,
      ...source.footer,
      socials:
        Array.isArray(source.footer?.socials) && source.footer.socials.length
          ? source.footer.socials
          : DEFAULT_LANDING_CONFIG.footer?.socials,
      copyright:
        cleanString(source.footer?.copyright) || DEFAULT_LANDING_CONFIG.footer?.copyright,
    },
  };

  return applySequentialSectionLabels(merged);
}

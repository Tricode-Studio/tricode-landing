import type {
  LandingClientLogo,
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

type SectionMeta = {
  id: LandingSectionId;
  navLabel?: string;
  navHref?: string;
};

const SECTION_META: SectionMeta[] = [
  { id: 'hero' },
  { id: 'stats' },
  { id: 'clients' },
  { id: 'services', navLabel: 'Servicios', navHref: '#servicios' },
  { id: 'cms', navLabel: 'CMS', navHref: '#cms' },
  { id: 'statement' },
  { id: 'projects', navLabel: 'Proyectos', navHref: '#proyectos' },
  { id: 'process' },
  { id: 'included' },
  { id: 'about', navLabel: 'Nosotros', navHref: '#nosotros' },
  { id: 'contact', navLabel: 'Contacto', navHref: '#contacto' },
];

// Secciones apagadas a propósito (se reactivan sacándolas de este set):
// - 'clients': la banda "Confianza" queda oculta hasta juntar más logos/marcas
//   (hoy son 3 y en texto plano). El componente ClientLogos y los datos
//   DEFAULT_CLIENTS quedan intactos — alcanza con quitar 'clients' de acá.
const DISABLED_SECTIONS = new Set<LandingSectionId>(['clients']);

const DEFAULT_LAYOUT_SECTIONS: LandingSectionLayout[] = SECTION_META.map((section) => ({
  id: section.id,
  enabled: !DISABLED_SECTIONS.has(section.id),
  navLabel: section.navLabel,
  navHref: section.navHref,
}));

const DEFAULT_SERVICES: LandingService[] = [
  {
    title: 'Landing page',
    desc: 'Landing pages pensadas para convertir tráfico en consultas reales, con estructura clara, velocidad alta y medición de conversiones.',
    tag: 'Alta conversión',
    audience: 'Ideal para empresas de servicios, campañas puntuales y lanzamientos que necesitan resultados rápidos.',
  },
  {
    title: 'Catálogos',
    desc: 'Mostrás todo tu catálogo de productos o servicios, organizado y fácil de navegar, sin necesidad de checkout ni pagos online.',
    tag: 'Catálogo digital',
    audience: 'Ideal para negocios que venden por WhatsApp, showroom o local físico y quieren mostrar su catálogo online.',
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
    title: 'Blogs',
    desc: 'Espacio de contenido propio para publicar artículos y novedades, integrado a tu sitio y editable desde tu CMS, pensado para SEO de largo plazo.',
    tag: 'Contenido y SEO',
    audience: 'Ideal para marcas que quieren posicionarse con contenido y atraer tráfico orgánico.',
  },
];

// Logos de clientes: la banda de prueba social más importante. `src` es opcional
// -- si falta, ClientLogos renderiza el nombre como texto (fallback), así la
// sección nunca queda vacía mientras se cargan los archivos reales de logo.
const DEFAULT_CLIENTS: LandingClientLogo[] = [
  { name: 'Cuevas Automóviles' },
  { name: 'Ricardo L. Díaz' },
  { name: 'Maite Inmobiliaria' },
];

// Equipo: se muestra solo en /nosotros (no en el home). Sin fotos a propósito
// -- las cards son editoriales (nombre/rol/bio), ver Team.tsx.
const DEFAULT_TEAM: LandingTeamMember[] = [
  {
    name: 'Diego Barrera',
    role: 'Desarrollo backend',
    bio: 'Arquitectura, APIs y escalabilidad. Se asegura de que lo que construimos aguante y crezca.',
  },
  {
    name: 'Lautaro Deccia',
    role: 'Desarrollo full stack',
    bio: 'Experiencias web, interfaces y rendimiento. Traduce el diseño en producto rápido y pulido.',
  },
  {
    name: 'Juan Diego Elissalde',
    role: 'Full stack y producto',
    bio: 'Producto, ejecución técnica y foco en negocio. El puente entre lo que necesitás y lo que entregamos.',
  },
];

const DEFAULT_CMS_FEATURES: LandingCmsFeature[] = [
  {
    icon: 'edit',
    title: 'Autogestión total',
    desc: 'Editás textos, imágenes, productos, proyectos o reservas sin escribir una línea de código y sin pedirnos cambios.',
  },
  {
    icon: 'people',
    title: 'Interfaz hecha para personas',
    desc: 'Pensado para no-técnicos: campos claros, vistas previas en vivo y guardado seguro. Si sabés usar Instagram, lo vas a manejar.',
  },
  {
    icon: 'puzzle',
    title: 'Adaptado a tu negocio',
    desc: 'Cada CMS se modela según tus entidades reales: catálogo, citas, casos, equipo. No hay campos sobrantes ni atajos genéricos.',
  },
  {
    icon: 'bolt',
    title: 'Cambios al instante',
    desc: 'Lo que actualizás aparece publicado en segundos. Sin recompilar, sin esperar a un desarrollador, sin riesgo de romper nada.',
  },
];

// El orden importa: IncludedIcon (en Included.tsx) mapea el ícono SVG por índice.
const DEFAULT_INCLUDED_ITEMS: LandingCmsFeature[] = [
  {
    title: 'Dominio y correos profesionales',
    desc: 'Tu dominio (tudominio.com) y correos tuequipo@tudominio.com configurados y funcionando desde el día uno, no un Gmail genérico.',
  },
  {
    title: 'Hosting e infraestructura',
    desc: 'Servidores, certificados SSL y despliegue continuo. La parte técnica de tenerlo online la gestionamos nosotros.',
  },
  {
    title: 'CMS a medida incluido',
    desc: 'El panel para autogestionar tu contenido viene con cada proyecto, sin costo aparte ni licencias de terceros.',
  },
  {
    title: 'Mantenimiento y backups',
    desc: 'Actualizaciones, copias de seguridad y monitoreo para que todo siga funcionando sin sorpresas.',
  },
  {
    title: 'SEO técnico',
    desc: 'Estructura, metadatos, sitemap y velocidad pensados desde el inicio para que Google te encuentre.',
  },
  {
    title: 'Soporte directo',
    desc: 'Hablás con el mismo equipo que construyó tu proyecto, no con una cola de tickets genérica.',
  },
];

const DEFAULT_STEPS: LandingStep[] = [
  { n: '01', title: 'Idea', desc: 'Entendemos tu negocio, contexto y objetivo.' },
  { n: '02', title: 'Diseño', desc: 'Definimos estructura, experiencia y propuesta visual.' },
  { n: '03', title: 'Desarrollo', desc: 'Construimos con entregas iterativas y feedback continuo.' },
  { n: '04', title: 'Lanzamiento', desc: 'Publicamos y dejamos todo operativo y medible.' },
  { n: '05', title: 'Evolución', desc: 'Medimos cómo se usa y mejoramos sobre datos reales.' },
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
    included: {
      ...config.included,
      sectionLabel: renumberSectionLabel(
        config.included?.sectionLabel ?? '',
        indexBySection.get('included') ?? 4,
      ),
    },
    projects: {
      ...config.projects,
      sectionLabel: renumberSectionLabel(
        config.projects?.sectionLabel ?? '',
        indexBySection.get('projects') ?? 4,
      ),
    },
    process: {
      ...config.process,
      sectionLabel: renumberSectionLabel(
        config.process?.sectionLabel ?? '',
        indexBySection.get('process') ?? 5,
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
  // Nav a nivel de páginas (no anclas a secciones del home). El botón "Hablemos"
  // (ctaHref) apunta a #contacto y desde subpáginas se normaliza a /#contacto.
  nav: {
    links: [
      { href: '/', label: 'Inicio' },
      { href: '/nosotros', label: 'Nosotros' },
      { href: '/proyectos', label: 'Proyectos' },
    ],
    ctaLabel: 'Hablemos',
    ctaHref: '#contacto',
  },
  hero: {
    rotatingWords: ['ideas', 'productos', 'marcas', 'experiencias'],
    titlePrefix: 'Transformamos',
    titleSuffix: 'en producto digital que crece.',
    description:
      'Estudio de producto, diseño y desarrollo en Uruguay. Trabajás directo con quien diseña y construye tu proyecto, de la idea al lanzamiento.',
    primaryCtaLabel: 'Empezar un proyecto',
    primaryCtaHref: '#contacto',
    secondaryCtaLabel: 'Ver servicios',
    secondaryCtaHref: '#servicios',
    statusLabel: 'estado: en línea',
    techStack: ['React', 'Next.js', 'Node', 'TypeScript', 'PostgreSQL', 'Docker'],
    backgroundImage: '/hero.webp',
  },
  stats: [
    { value: '2023', label: 'Estudio activo desde' },
    { value: '24 h', label: 'Respuesta promedio' },
    { value: 'Full-stack', label: 'Producto, diseño y código in-house' },
    { value: 'Uruguay', label: 'Base local · trabajo remoto' },
  ],
  about: {
    sectionLabel: 'Sobre nosotros',
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
      text: 'Tomamos pocos proyectos a la vez para poder meternos a fondo en cada uno.',
      highlight: 'Nuestro mejor marketing es que tu web funcione.',
    },
  },
  services: {
    sectionLabel: 'Servicios',
    titleTop: '¿Qué podemos',
    titleHighlight: 'construir para vos?',
    description:
      'Cinco formatos concretos. Todos se entregan funcionando, con dominio, CMS y soporte incluidos — elegí el que tu negocio necesita hoy.',
    items: DEFAULT_SERVICES,
  },
  clients: {
    sectionLabel: 'Confianza',
    title: 'Marcas que ya construyeron con nosotros',
    logos: DEFAULT_CLIENTS,
  },
  team: {
    sectionLabel: 'Equipo',
    titleTop: 'Las personas',
    titleHighlight: 'detrás del código.',
    description: 'Amigos antes que colegas. Producto, diseño y desarrollo, lado a lado.',
    members: DEFAULT_TEAM,
  },
  process: {
    sectionLabel: 'Proceso',
    titleTop: 'De la idea al producto',
    titleHighlight: 'en 5 pasos.',
    description: 'Cinco etapas sin misterio: siempre sabés en qué está tu proyecto y qué viene después.',
    steps: DEFAULT_STEPS,
  },
  cms: {
    sectionLabel: 'Producto estrella',
    titleTop: 'Tu propio panel para',
    titleHighlight: 'gestionar todo, sin depender de nadie.',
    description:
      'Es lo que más nos diferencia: no es un plugin genérico ni un extra que se cobra aparte. Cada proyecto se entrega con un CMS hecho a la medida de tu negocio. Editás contenido, productos, reservas o casos cuando quieras, desde una interfaz que cualquier persona del equipo puede usar.',
    features: DEFAULT_CMS_FEATURES,
    panelTitle: 'Tu CMS · Demo',
    panelSubtitle: 'Panel de control',
    panelMetricLabel: 'Cambios publicados este mes',
    panelMetricValue: '128',
    panelEntities: ['Proyectos', 'Servicios', 'Equipo', 'Hero', 'Footer'],
    primaryCtaLabel: 'Ver una demo en vivo',
    primaryCtaHref: '#contacto',
    secondaryCtaLabel: 'Cómo funciona',
    secondaryCtaHref: '#proceso',
  },
  included: {
    sectionLabel: 'Todo incluido',
    titleTop: 'Todo lo que incluye tu proyecto,',
    titleHighlight: 'sin costos ocultos.',
    description:
      'Cuando cotizamos, esto ya está adentro. Nada de "eso se cobra aparte": dominio, correos, hosting, tu CMS, mantenimiento y soporte forman parte de lo que recibís y de lo que pagás.',
    items: DEFAULT_INCLUDED_ITEMS,
  },
  projects: {
    sectionLabel: 'Proyectos',
    title: 'Lo que somos capaces',
    titleHighlight: 'de construir.',
    description: 'Proyectos en producción, que sus dueños usan y actualizan todos los días.',
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
  contact: {
    sectionLabel: 'Hablemos',
    titleTop: 'Tu próximo proyecto',
    titleHighlight: 'empieza con una charla.',
    description: 'Completá un cuestionario estratégico y te devolvemos una propuesta clara de alcance, tiempos y costo.',
    whatsappNumber: '091035868',
    whatsappText: '¡Hola Tricode! Quiero cotizar un proyecto.',
    email: 'contacto@tricode.studio',
    primaryCtaLabel: 'Escribinos por WhatsApp',
    primaryCtaHref: '',
    secondaryCtaLabel: 'contacto@tricode.studio',
    secondaryCtaHref: 'https://mail.google.com/mail/?view=cm&fs=1',
    emailSubject: 'Quiero cotizar un proyecto con Tricode',
    emailBody:
      '¡Hola Tricode! Quiero conversar sobre una landing, sistema o automatización para mi marca.',
    location: 'Trinidad, Flores, Uruguay',
  },
  footer: {
    socials: [
      { label: 'Instagram', url: 'https://instagram.com/tricode.studio' },
      { label: 'Email', url: 'mailto:contacto@tricode.studio' },
    ],
    copyright: `© ${new Date().getFullYear()} Tricode Studio. Todos los derechos reservados.`,
  },
};

export function withLandingDefaults(rawConfig: LandingConfig | null | undefined): LandingConfig {
  const source = rawConfig ?? {};
  const servicesSource: ServicesBlock = Array.isArray(source.services)
    ? { items: source.services }
    : (source.services as ServicesBlock) ?? {};
  const defaultServicesBlock: ServicesBlock = (DEFAULT_LANDING_CONFIG.services as ServicesBlock) ?? {};

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
    clients: {
      ...DEFAULT_LANDING_CONFIG.clients,
      ...source.clients,
      sectionLabel:
        cleanString(source.clients?.sectionLabel) || DEFAULT_LANDING_CONFIG.clients?.sectionLabel,
      title: cleanString(source.clients?.title) || DEFAULT_LANDING_CONFIG.clients?.title,
      logos:
        Array.isArray(source.clients?.logos) && source.clients.logos.length
          ? source.clients.logos
          : DEFAULT_LANDING_CONFIG.clients?.logos,
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
    included: {
      ...DEFAULT_LANDING_CONFIG.included,
      ...source.included,
      sectionLabel:
        cleanString(source.included?.sectionLabel) || DEFAULT_LANDING_CONFIG.included?.sectionLabel,
      titleTop:
        cleanString(source.included?.titleTop) || DEFAULT_LANDING_CONFIG.included?.titleTop,
      titleHighlight:
        cleanString(source.included?.titleHighlight) ||
        DEFAULT_LANDING_CONFIG.included?.titleHighlight,
      description:
        cleanString(source.included?.description) || DEFAULT_LANDING_CONFIG.included?.description,
      items:
        Array.isArray(source.included?.items) && source.included.items.length
          ? source.included.items
          : DEFAULT_LANDING_CONFIG.included?.items,
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

import type { LandingConfig } from '../content/LandingDataContext';

const DEFAULT_SITE_URL = 'https://www.tricode.studio';
const DEFAULT_OG_IMAGE = '/branding.png';
const DEFAULT_FOUNDING_YEAR = '2023';
const SITE_NAME = 'Tricode Studio';

function cleanString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeSiteUrl(value: string) {
  const candidate = cleanString(value).replace(/\/+$/, '');
  if (!candidate) return DEFAULT_SITE_URL;
  try {
    const parsed = new URL(candidate);
    return parsed.origin + parsed.pathname.replace(/\/+$/, '');
  } catch {
    return DEFAULT_SITE_URL;
  }
}

function toAbsoluteUrl(siteUrl: string, path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

function ensureMetaByName(name: string) {
  let element = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  return element;
}

function ensureMetaByProperty(property: string) {
  let element = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  return element;
}

function ensureLink(rel: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  return element;
}

function setJsonLd(id: string, payload: Record<string, unknown>) {
  let script = document.head.querySelector(`#${id}`) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}

function normalizeSocialUrl(value: string) {
  const normalized = cleanString(value);
  if (!normalized || normalized.startsWith('mailto:')) {
    return '';
  }
  try {
    return new URL(normalized).toString();
  } catch {
    return '';
  }
}

function getCanonicalPath(route: string) {
  if (route.startsWith('/proyectos')) {
    return '/proyectos';
  }
  if (route.startsWith('/brief')) {
    return '/brief';
  }
  return '/';
}

function normalizeUruguayPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('598')) return `+${digits}`;
  if (digits.startsWith('0')) return `+598${digits.slice(1)}`;
  if (digits.length === 8 || digits.length === 9) return `+598${digits}`;
  return `+${digits}`;
}

export function applyLandingSeo(route: string, config: LandingConfig) {
  const siteUrl = normalizeSiteUrl(import.meta.env.VITE_SITE_URL ?? DEFAULT_SITE_URL);
  const canonicalPath = getCanonicalPath(route);
  const canonicalUrl = toAbsoluteUrl(siteUrl, canonicalPath);

  const brandName = cleanString(config.brandName) || 'Tricode Studio';
  const heroDescription =
    cleanString(config.hero?.description) ||
    'Diseño y desarrollo web a medida para empresas en Uruguay y Latam.';
  const projectsDescription =
    cleanString(config.projects?.pageDescription) ||
    'Casos reales de desarrollo web, landing pages y sistemas creados por Tricode.';
  const briefDescription =
    'Completá el cuestionario estratégico de Tricode para cotizar tu proyecto con alcance, tiempos y presupuesto claro.';
  const contactEmail = cleanString(config.contact?.email);
  const normalizedPhone = normalizeUruguayPhone(
    cleanString(config.contact?.whatsappNumber),
  );
  const faqItems = Array.isArray(config.faq?.items)
    ? config.faq.items
        .map((item) => ({
          question: cleanString(item?.question),
          answer: cleanString(item?.answer),
        }))
        .filter((item) => item.question && item.answer)
    : [];
  const sameAs = (config.footer?.socials ?? [])
    .map((item) => normalizeSocialUrl(cleanString(item.url)))
    .filter(Boolean);

  const isProjectsPage = canonicalPath === '/proyectos';
  const isBriefPage = canonicalPath === '/brief';
  const title = isProjectsPage
    ? `Proyectos de ${brandName} | Desarrollo web y software a medida`
    : isBriefPage
      ? `Cuestionario de Proyecto | ${brandName}`
    : `${brandName} | Desarrollo web y software a medida en Uruguay`;
  const description = isProjectsPage
    ? `${projectsDescription} Conocé proyectos de Tricode y su impacto en negocio.`
    : isBriefPage
      ? briefDescription
    : `${heroDescription} En Tricode creamos landing pages, e-commerce y sistemas personalizados.`;
  const ogImageUrl = toAbsoluteUrl(siteUrl, DEFAULT_OG_IMAGE);
  const keywords = [
    'Tricode',
    'Tricode Studio',
    'desarrollo web Uruguay',
    'agencia de software Uruguay',
    'landing pages',
    'ecommerce',
    'sistemas a medida',
  ].join(', ');

  document.title = title;

  ensureMetaByName('description').setAttribute('content', description);
  ensureMetaByName('application-name').setAttribute('content', SITE_NAME);
  ensureMetaByName('robots').setAttribute('content', 'index, follow, max-image-preview:large');
  ensureMetaByName('keywords').setAttribute('content', keywords);
  ensureMetaByName('author').setAttribute('content', brandName);
  ensureMetaByName('twitter:card').setAttribute('content', 'summary_large_image');
  ensureMetaByName('twitter:title').setAttribute('content', title);
  ensureMetaByName('twitter:description').setAttribute('content', description);
  ensureMetaByName('twitter:image').setAttribute('content', ogImageUrl);

  ensureMetaByProperty('og:type').setAttribute('content', 'website');
  ensureMetaByProperty('og:site_name').setAttribute('content', SITE_NAME);
  ensureMetaByProperty('og:locale').setAttribute('content', 'es_UY');
  ensureMetaByProperty('og:title').setAttribute('content', title);
  ensureMetaByProperty('og:description').setAttribute('content', description);
  ensureMetaByProperty('og:url').setAttribute('content', canonicalUrl);
  ensureMetaByProperty('og:image').setAttribute('content', ogImageUrl);

  ensureLink('canonical').setAttribute('href', canonicalUrl);

  const graph: Array<Record<string, unknown>> = [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: brandName,
      alternateName: ['Tricode', 'Tricode Studio'],
      url: siteUrl,
      logo: toAbsoluteUrl(siteUrl, '/isotipo.png?v=20260427-1'),
      description: heroDescription,
      foundingDate: DEFAULT_FOUNDING_YEAR,
      ...(normalizedPhone ? { telephone: normalizedPhone } : {}),
      ...(contactEmail ? { email: contactEmail } : {}),
      ...(sameAs.length ? { sameAs } : {}),
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${siteUrl}/#service`,
      name: brandName,
      url: siteUrl,
      description: heroDescription,
      areaServed: ['Uruguay', 'Latinoamérica'],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Trinidad',
        addressRegion: 'Flores',
        addressCountry: 'UY',
      },
      ...(normalizedPhone ? { telephone: normalizedPhone } : {}),
      serviceType: ['Desarrollo web', 'Landing pages', 'E-commerce', 'Software a medida'],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: SITE_NAME,
      alternateName: ['tricode.studio', 'Tricode'],
      inLanguage: 'es',
    },
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: title,
      description,
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#organization` },
      inLanguage: 'es',
    },
  ];

  if (isProjectsPage) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Proyectos', item: canonicalUrl },
      ],
    });
  }
  if (isBriefPage) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Cuestionario', item: canonicalUrl },
      ],
    });
  }

  if (faqItems.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${siteUrl}/#faq`,
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  setJsonLd('tricode-ld-json', {
    '@context': 'https://schema.org',
    '@graph': graph,
  });
}

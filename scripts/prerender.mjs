// Prerender de <head> por ruta para las páginas FIJAS (/, /nosotros,
// /proyectos, /brief). NO genera HTML por proyecto (/proyectos/:slug es
// dinámico, depende del CMS, y sigue siendo 100% client-rendered).
//
// Por qué esto y no un headless browser: el copy/config de la Landing es
// 100% estático (`withLandingDefaults({})`, sin override remoto), así que el
// <head> por ruta (title/description/OG/canonical/JSON-LD) es puramente
// determinístico en build-time -- no hace falta levantar Chromium para
// calcularlo. El problema real que esto arregla: hoy TODAS las rutas
// comparten el mismo <head> estático de Home hasta que corre el JS del
// cliente (`applyLandingSeo`); cualquier bot o unfurler que no ejecuta JS
// (WhatsApp, Slack, Twitter/X, LinkedIn, y el primer pase de varios
// crawlers) ve siempre el título/descripción de Home sin importar la
// página. Esto reusa `computeLandingMeta` (la misma función que corre en
// runtime) vía Vite SSR module loading, así nunca hay dos fuentes de verdad.
import { createServer } from 'vite';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

const ROUTES = [
  { route: '/', out: 'index.html' },
  { route: '/nosotros', out: 'nosotros/index.html' },
  { route: '/proyectos', out: 'proyectos/index.html' },
  { route: '/brief', out: 'brief/index.html' },
  { route: '/privacidad', out: 'privacidad/index.html' },
];

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function replaceMetaContent(html, attrSelector, value) {
  const re = new RegExp(`(<meta\\s+${attrSelector}\\s+content=")[^"]*(")`);
  if (!re.test(html)) {
    throw new Error(`prerender: no encontré el meta tag "${attrSelector}" en dist/index.html`);
  }
  return html.replace(re, `$1${escapeAttr(value)}$2`);
}

function applyMeta(template, meta) {
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  html = replaceMetaContent(html, 'name="description"', meta.description);
  html = replaceMetaContent(html, 'name="keywords"', meta.keywords);
  html = replaceMetaContent(html, 'name="author"', meta.brandName);
  html = replaceMetaContent(html, 'name="twitter:title"', meta.title);
  html = replaceMetaContent(html, 'name="twitter:description"', meta.description);
  html = replaceMetaContent(html, 'name="twitter:image"', meta.ogImageUrl);
  html = replaceMetaContent(html, 'property="og:title"', meta.title);
  html = replaceMetaContent(html, 'property="og:description"', meta.description);
  html = replaceMetaContent(html, 'property="og:url"', meta.canonicalUrl);
  html = replaceMetaContent(html, 'property="og:image"', meta.ogImageUrl);

  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeAttr(meta.canonicalUrl)}" />`,
  );

  // El mismo id que usa `setJsonLd('tricode-ld-json', ...)` en runtime, para
  // que la hidratación ACTUALICE este script en vez de crear uno duplicado.
  const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': meta.graph });
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="tricode-ld-json">${jsonLd}</script>`,
  );

  return html;
}

async function main() {
  const template = readFileSync(path.join(distDir, 'index.html'), 'utf8');

  const server = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const seoModule = await server.ssrLoadModule('/src/lib/seo.ts');
    const configModule = await server.ssrLoadModule('/src/content/defaultLandingConfig.ts');
    const config = configModule.withLandingDefaults({});

    for (const { route, out } of ROUTES) {
      const meta = seoModule.computeLandingMeta(route, config, []);
      const html = applyMeta(template, meta);
      const outPath = path.join(distDir, out);
      mkdirSync(path.dirname(outPath), { recursive: true });
      writeFileSync(outPath, html, 'utf8');
      console.log(`[prerender] ${route.padEnd(11)} -> ${path.relative(root, outPath)}  "${meta.title}"`);
    }
  } finally {
    await server.close();
  }
}

main().catch((err) => {
  console.error('[prerender] falló:', err);
  process.exit(1);
});

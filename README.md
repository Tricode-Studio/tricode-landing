# Tricode Studio — Landing

Landing page oficial de **Tricode Studio**. Stack:

- Vite + React 18 + TypeScript
- TailwindCSS 3
- Space Grotesk + JetBrains Mono (Google Fonts)
- Integración con API CMS (`landing_config` + `proyectos`)

## Desarrollo

```bash
npm install
npm run dev
```

La app abre en `http://localhost:5173`.

## Variables de entorno

Crear `.env` desde `.env.example`:

```bash
cp .env.example .env
```

- `VITE_API_BASE_URL` URL base de API (`https://tu-api/api/v1`)
- `VITE_TENANT_SLUG` tenant de landing (ej: `mi-tenant`)
- `VITE_PROJECTS_CONTENT_SLUG` slug de colección de proyectos (ej: `proyectos`)
- `VITE_SITE_URL` URL canónica del sitio (ej: `https://www.tricode.studio`)

## Build de producción

```bash
npm run build
npm run preview
```

## Estructura

```
public/                imágenes de marca (hero, isotipo, etc.)
src/
  App.tsx              composición de secciones
  index.css            tokens, base, componentes Tailwind
  components/
    Nav.tsx
    Hero.tsx           usa /hero.png
    Stats.tsx
    About.tsx
    Services.tsx
    Team.tsx
    Process.tsx
    Projects.tsx
    Contact.tsx
    Footer.tsx
```

## Personalización rápida

- Colores y tokens: `tailwind.config.js` (`brand`, `ink`).
- Texto y datos: desde CMS en `settings/landing_config` (fallback vacío si falta).
- Logo: reemplazar `public/isotipo.png` y `public/hero.png` manteniendo nombres.
- Proyectos: colección `proyectos` del CMS.

## Deploy en Vercel

```bash
npm run build
vercel
```

Variables en Vercel:

- `VITE_API_BASE_URL`
- `VITE_TENANT_SLUG`
- `VITE_PROJECTS_CONTENT_SLUG`
- `VITE_SITE_URL`

import { useLandingData } from '../content/LandingDataContext';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

const BASE_TECH_STACK = [
  'React',
  'Next.js',
  'Angular',
  'Vue',
  'Astro',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'NestJS',
  'Express',
  'Python',
  'TailwindCSS',
  'Sass',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Prisma',
  'GraphQL',
  'Firebase',
  'Vercel',
  'Docker',
  'Git',
  'GitHub',
  'Mercado Pago',
  'Stripe',
  'PayPal',
  'Figma',
  'Framer',
  'Vite',
];

function normalizeTechName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function resolveTechSlug(name: string) {
  const normalized = normalizeTechName(name);
  const slugs: Record<string, string> = {
    react: 'react',
    nextjs: 'nextdotjs',
    node: 'nodedotjs',
    nodedotjs: 'nodedotjs',
    typescript: 'typescript',
    javascript: 'javascript',
    postgresql: 'postgresql',
    docker: 'docker',
    tailwindcss: 'tailwindcss',
    prisma: 'prisma',
    nestjs: 'nestjs',
    express: 'express',
    vuedotjs: 'vuedotjs',
    vue: 'vuedotjs',
    angular: 'angular',
    mongodb: 'mongodb',
    mysql: 'mysql',
    stripe: 'stripe',
    mercadopago: 'mercadopago',
    paypal: 'paypal',
    figma: 'figma',
    framer: 'framer',
    astro: 'astro',
    sass: 'sass',
    graphql: 'graphql',
    firebase: 'firebase',
    vercel: 'vercel',
    git: 'git',
    github: 'github',
    python: 'python',
    vite: 'vite',
  };

  return slugs[normalized] ?? null;
}

export default function Marquee() {
  const { config } = useLandingData();
  const techsFromConfig =
    Array.isArray(config.hero?.techStack)
      ? config.hero.techStack.map((item) => trimmed(item)).filter(Boolean)
      : [];
  const seen = new Set<string>();
  const techs = [...techsFromConfig, ...BASE_TECH_STACK].filter((tech) => {
    const normalized = normalizeTechName(tech);
    if (!normalized || seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return true;
  });

  if (!techs.length) {
    return null;
  }

  const loopItems = [...techs, ...techs];

  return (
    <div className="relative py-8 border-y border-white/5 overflow-hidden bg-ink-900/30">
      <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-ink-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-ink-950 to-transparent z-10 pointer-events-none" />

      <div className="marquee-track">
        {loopItems.map((tech, index) => {
          const slug = resolveTechSlug(tech);
          return (
            <div key={`${tech}-${index}`} className="flex items-center gap-3 shrink-0 group">
              {slug ? (
                <img
                  src={`https://cdn.simpleicons.org/${slug}/a78bfa`}
                  alt={tech}
                  loading="lazy"
                  draggable={false}
                  className="h-4 w-4 sm:h-5 sm:w-5 opacity-75 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <span className="h-2 w-2 rounded-full bg-brand-purple/70 group-hover:bg-brand-purple transition-colors" />
              )}
              <span className="font-mono text-xs sm:text-sm md:text-base uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 group-hover:text-white transition-colors whitespace-nowrap">
                {tech}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

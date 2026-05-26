import { useLandingData } from '../content/LandingDataContext';

const BRAND_MARK_SRC = '/isotipo.png?v=20260427-1';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isProjectsLocation() {
  const path = window.location.pathname;
  const hash = window.location.hash.replace(/^#/, '');
  return path.startsWith('/proyectos') || hash.startsWith('/proyectos');
}

function iconFor(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes('instagram')) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    );
  }

  if (normalized.includes('linkedin')) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    );
  }

  if (normalized.includes('facebook')) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export default function Footer() {
  const { config } = useLandingData();
  const socials =
    Array.isArray(config.footer?.socials)
      ? config.footer.socials
          .map((social) => ({
            label: trimmed(social?.label),
            url: trimmed(social?.url),
          }))
          .filter((social) => social.label && social.url)
      : [];
  const brandName = trimmed(config.brandName);
  const [brandTop, ...brandBottomParts] = brandName.split(' ');
  const brandBottom = brandBottomParts.join(' ').trim();
  const copyright = trimmed(config.footer?.copyright);
  const isProjects = isProjectsLocation();
  const brandHref = isProjects ? '/' : '#top';

  return (
    <footer className="relative border-t border-white/5 py-10">
      <div className="container-x flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <a href={brandHref} className="flex items-center gap-2 -ml-3 md:-ml-4">
          <img src={BRAND_MARK_SRC} alt={`Logo de ${brandName || 'Tricode Studio'}`} className="h-12 md:h-14 w-auto object-contain" />
          {brandName ? (
            <div className="flex flex-col items-center leading-none">
              {brandTop ? <span className="text-base md:text-lg font-semibold tracking-tight text-white">{brandTop}</span> : null}
              {brandBottom ? (
                <span className="mt-1 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.34em] text-brand-purple/90">
                  {brandBottom}
                </span>
              ) : null}
            </div>
          ) : null}
        </a>

        {socials.length ? (
          <div className="flex items-center gap-5 text-white/40">
            {socials.map((social) => (
              <a
                key={`${social.label}-${social.url}`}
                href={social.url}
                aria-label={social.label}
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-purple transition-colors"
              >
                {iconFor(social.label)}
              </a>
            ))}
          </div>
        ) : null}

        {copyright ? <div className="font-mono text-xs text-white/40 text-center md:text-right">{copyright}</div> : null}
      </div>
    </footer>
  );
}

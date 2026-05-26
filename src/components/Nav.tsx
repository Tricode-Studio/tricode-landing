import { useEffect, useState } from 'react';
import { useLandingData } from '../content/LandingDataContext';
import { resolveNavLinksFromLayout } from '../lib/sections';

const BRAND_MARK_SRC = '/isotipo.png?v=20260427-1';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isSecondaryLocation() {
  const path = window.location.pathname;
  const hash = window.location.hash.replace(/^#/, '');
  return (
    path.startsWith('/proyectos') ||
    hash.startsWith('/proyectos') ||
    path.startsWith('/brief') ||
    hash.startsWith('/brief')
  );
}

function normalizeFromSecondaryRoute(href: string) {
  if (!href) return href;

  if (href.startsWith('#/')) {
    return href.slice(1);
  }

  if (href.startsWith('#')) {
    return `/${href}`;
  }

  return href;
}

export default function Nav() {
  const { config } = useLandingData();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = resolveNavLinksFromLayout(config);
  const brandName = trimmed(config.brandName);
  const [brandTop, ...brandBottomParts] = brandName.split(' ');
  const brandBottom = brandBottomParts.join(' ').trim();
  const ctaLabel = trimmed(config.nav?.ctaLabel);
  const ctaHref = trimmed(config.nav?.ctaHref);
  const hasMobileMenu = Boolean(links.length || (ctaLabel && ctaHref));
  const isSecondaryPage = isSecondaryLocation();
  const brandHref = isSecondaryPage ? '/' : '#top';
  const resolvedCtaHref = isSecondaryPage ? normalizeFromSecondaryRoute(ctaHref) : ctaHref;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/5 bg-ink-950/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="container-x flex items-center justify-between gap-8 py-2 md:py-2.5">
        <a href={brandHref} className="flex items-center gap-1.5 sm:gap-2 shrink-0 -ml-2 sm:-ml-4 md:-ml-6">
          <img src={BRAND_MARK_SRC} alt={`Logo de ${brandName || 'Tricode Studio'}`} className="h-8 sm:h-9 md:h-10 w-auto object-contain" />
          {brandName ? (
            <div className="flex flex-col items-center leading-none">
              {brandTop ? <span className="text-xs sm:text-base md:text-lg font-semibold tracking-tight text-white">{brandTop}</span> : null}
              {brandBottom ? (
                <span className="mt-0.5 font-mono text-[6px] sm:text-[7px] md:text-[8px] uppercase tracking-[0.22em] sm:tracking-[0.3em] text-brand-purple/90">
                  {brandBottom}
                </span>
              ) : null}
            </div>
          ) : null}
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={isSecondaryPage ? normalizeFromSecondaryRoute(link.href) : link.href}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {ctaLabel && resolvedCtaHref ? (
            <a
              href={resolvedCtaHref}
              className="hidden sm:inline-flex group items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-md px-5 py-2 text-sm font-medium text-white/90 transition-all duration-200 hover:border-brand-purple/60 hover:bg-brand-purple/10 hover:text-white"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-purple opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-purple" />
              </span>
              {ctaLabel}
              <span aria-hidden className="text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all">
                →
              </span>
            </a>
          ) : null}
          {hasMobileMenu ? (
            <button
              aria-label="Menú"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10"
              onClick={() => setOpen((value) => !value)}
            >
              <span className="block h-0.5 w-5 bg-white relative before:content-[''] before:absolute before:-top-1.5 before:left-0 before:h-0.5 before:w-5 before:bg-white after:content-[''] after:absolute after:top-1.5 after:left-0 after:h-0.5 after:w-5 after:bg-white" />
            </button>
          ) : null}
        </div>
      </div>

      {open && hasMobileMenu ? (
        <div className="md:hidden border-t border-white/5 bg-ink-950/95 backdrop-blur-xl">
          <div className="container-x py-4 flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={isSecondaryPage ? normalizeFromSecondaryRoute(link.href) : link.href}
                onClick={() => setOpen(false)}
                className="py-2 text-white/80"
              >
                {link.label}
              </a>
            ))}
            {ctaLabel && resolvedCtaHref ? (
              <a href={resolvedCtaHref} onClick={() => setOpen(false)} className="btn-primary mt-2">
                {ctaLabel} →
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}

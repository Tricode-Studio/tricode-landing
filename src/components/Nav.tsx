import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLandingData } from '../content/LandingDataContext';
import { resolveNavLinksFromLayout } from '../lib/sections';
import { EASE_OUT_EXPO } from '../lib/motion';

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
  if (href.startsWith('#/')) return href.slice(1);
  if (href.startsWith('#')) return `/${href}`;
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
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.05 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/8 bg-ink-950/80 backdrop-blur-xl'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-wide flex items-center justify-between gap-8 py-3 md:py-3.5">
        <a
          href={brandHref}
          className="flex items-center gap-2 shrink-0 group"
        >
          <motion.img
            whileHover={{ rotate: -8, scale: 1.05 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            src={BRAND_MARK_SRC}
            alt={`Logo de ${brandName || 'Tricode Studio'}`}
            className="h-9 md:h-10 w-auto object-contain"
          />
          {brandName ? (
            <div className="flex flex-col items-start leading-none">
              {brandTop ? (
                <span className="display-md text-base md:text-lg font-normal tracking-tight text-white">
                  {brandTop}
                </span>
              ) : null}
              {brandBottom ? (
                <span className="mt-1 font-mono text-[7px] md:text-[8px] uppercase tracking-[0.32em] text-brand-purple/90">
                  {brandBottom}
                </span>
              ) : null}
            </div>
          ) : null}
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={isSecondaryPage ? normalizeFromSecondaryRoute(link.href) : link.href}
              className="relative px-3 py-2 text-[13px] font-mono uppercase tracking-[0.15em] text-white/65 transition-colors hover:text-white"
            >
              <span className="link-reveal">{link.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {ctaLabel && resolvedCtaHref ? (
            <motion.a
              href={resolvedCtaHref}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
              className="hidden sm:inline-flex group items-center gap-2.5 rounded-full bg-grad-brand px-5 py-2.5 text-[13px] font-medium text-white shadow-glow-sm hover:shadow-glow"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-white/70 opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              {ctaLabel}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </motion.a>
          ) : null}
          {hasMobileMenu ? (
            <button
              aria-label="Menú"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-md"
              onClick={() => setOpen((value) => !value)}
            >
              <motion.span
                animate={{ rotate: open ? 90 : 0 }}
                transition={{ duration: 0.3 }}
                className="block h-0.5 w-5 bg-white relative before:content-[''] before:absolute before:-top-1.5 before:left-0 before:h-0.5 before:w-5 before:bg-white after:content-[''] after:absolute after:top-1.5 after:left-0 after:h-0.5 after:w-5 after:bg-white"
              />
            </button>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {open && hasMobileMenu ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            className="md:hidden border-t border-white/8 bg-ink-950/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container-wide py-5 flex flex-col gap-1">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: EASE_OUT_EXPO }}
                  href={isSecondaryPage ? normalizeFromSecondaryRoute(link.href) : link.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-white/80 text-lg display-md border-b border-white/5"
                >
                  {link.label}
                </motion.a>
              ))}
              {ctaLabel && resolvedCtaHref ? (
                <a
                  href={resolvedCtaHref}
                  onClick={() => setOpen(false)}
                  className="btn-primary mt-4"
                >
                  {ctaLabel} →
                </a>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}

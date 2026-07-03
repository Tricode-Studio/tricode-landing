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
            <div className="flex items-baseline gap-1.5 leading-none">
              {brandTop ? (
                <span className="font-sans text-base md:text-lg font-semibold tracking-tight text-white">
                  {brandTop}
                </span>
              ) : null}
              {brandBottom ? (
                <span className="font-sans text-base md:text-lg font-medium tracking-tight text-white/45">
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
              className="relative px-3 py-2 font-sans text-[14px] font-medium text-white/65 transition-colors hover:text-white"
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
              className="hidden sm:inline-flex group items-center gap-2.5 rounded-full bg-bone-50 px-5 py-2.5 text-[13px] font-medium text-ink-950 hover:bg-brand-mist transition-colors"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-purple opacity-60 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-purple" />
              </span>
              {ctaLabel}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </motion.a>
          ) : null}
          {hasMobileMenu ? (
            <button
              type="button"
              aria-label="Menú"
              aria-expanded={open}
              className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 hover:bg-white/[0.06] active:bg-white/[0.1]"
              onClick={() => setOpen((value) => !value)}
            >
              <span className="relative flex h-[15px] w-5 flex-col justify-between">
                <motion.span
                  animate={{ rotate: open ? 45 : 0, y: open ? 6.5 : 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                  className="block h-[1.5px] w-full rounded-full bg-white origin-center"
                />
                <motion.span
                  animate={{ opacity: open ? 0 : 1, x: open ? 8 : 0 }}
                  transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
                  className="block h-[1.5px] w-full rounded-full bg-white"
                />
                <motion.span
                  animate={{ rotate: open ? -45 : 0, y: open ? -6.5 : 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                  className="block h-[1.5px] w-full rounded-full bg-white origin-center"
                />
              </span>
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
                  className="py-3 text-white/80 text-lg font-sans font-medium border-b border-white/5"
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

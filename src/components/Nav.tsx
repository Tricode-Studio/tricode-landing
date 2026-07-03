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
  const email = trimmed(config.contact?.email);
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

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header
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
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-30 bg-ink-950/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open && hasMobileMenu ? (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="md:hidden fixed inset-y-0 right-0 z-40 flex w-[78%] max-w-sm flex-col overflow-hidden border-l border-white/10 bg-ink-950/98 backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-purple/12 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-indigo/10 blur-[120px]" />

            <div className="eyebrow relative px-7 pt-24 pb-5">
              <span className="h-px w-6 bg-brand-purple/50" />
              Menú
            </div>

            <nav className="relative flex flex-1 flex-col overflow-y-auto px-7 pb-8">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: EASE_OUT_EXPO }}
                  href={isSecondaryPage ? normalizeFromSecondaryRoute(link.href) : link.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between gap-4 border-b border-white/8 py-4"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-brand-purple/70">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-sans text-2xl font-medium text-white/85 transition-colors group-hover:text-white">
                      {link.label}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="text-white/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-lavender"
                  >
                    →
                  </span>
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + links.length * 0.05, ease: EASE_OUT_EXPO }}
              className="relative border-t border-white/8 p-7"
            >
              {ctaLabel && resolvedCtaHref ? (
                <a
                  href={resolvedCtaHref}
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  {ctaLabel} →
                </a>
              ) : null}
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="mt-4 block text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white/70"
                >
                  {email}
                </a>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useLandingData } from '../content/LandingDataContext';
import { normalizeSectionLayout, resolveNavLinksFromLayout } from '../lib/sections';
import { EASE_OUT_EXPO } from '../lib/motion';

const BRAND_MARK_SRC = '/isotipo.webp?v=20260714-1';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isSecondaryLocation() {
  const path = window.location.pathname;
  const hash = window.location.hash.replace(/^#/, '');
  return (
    path.startsWith('/proyectos') ||
    hash.startsWith('/proyectos') ||
    path.startsWith('/nosotros') ||
    hash.startsWith('/nosotros') ||
    path.startsWith('/brief') ||
    hash.startsWith('/brief') ||
    path.startsWith('/privacidad') ||
    hash.startsWith('/privacidad')
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
  const [activeSection, setActiveSection] = useState('');
  const links = resolveNavLinksFromLayout(config);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 28, mass: 0.4 });
  const brandName = trimmed(config.brandName);
  const [brandTop, ...brandBottomParts] = brandName.split(' ');
  const brandBottom = brandBottomParts.join(' ').trim();
  const ctaLabel = trimmed(config.nav?.ctaLabel);
  const ctaHref = trimmed(config.nav?.ctaHref);
  const email = trimmed(config.contact?.email);
  const hasMobileMenu = Boolean(links.length || (ctaLabel && ctaHref));

  // Anclas a secciones del home para el menú mobile: llenan el drawer con
  // navegación útil sin duplicar los links principales (páginas).
  const sectionAnchors = normalizeSectionLayout(config)
    .filter((section) => section.enabled !== false && section.navLabel && section.navHref)
    .map((section) => ({ href: section.navHref as string, label: section.navLabel as string }))
    .filter(
      (anchor) =>
        !links.some((link) => link.label.trim().toLowerCase() === anchor.label.trim().toLowerCase()),
    );

  const socials = Array.isArray(config.footer?.socials)
    ? config.footer.socials
        .map((social) => ({ label: trimmed(social?.label), url: trimmed(social?.url) }))
        .filter((social) => social.label && social.url && !social.url.startsWith('mailto:'))
    : [];
  const isSecondaryPage = isSecondaryLocation();
  const brandHref = isSecondaryPage ? '/' : '#top';
  const resolvedCtaHref = isSecondaryPage ? normalizeFromSecondaryRoute(ctaHref) : ctaHref;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scrollspy: resalta en la nav la sección visible (solo en la home, donde
  // los links son anclas #seccion). Usa una banda central del viewport para
  // decidir cuál está "activa".
  const anchorIds = links
    .map((link) => link.href)
    .filter((href) => href.startsWith('#') && !href.startsWith('#/'))
    .map((href) => href.slice(1))
    .join(',');

  useEffect(() => {
    if (isSecondaryPage || !anchorIds) return undefined;
    const sections = anchorIds
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    sections.forEach((section) => observer.observe(section));

    // Al volver al hero (arriba de todo) no hay sección activa.
    const clearOnTop = () => {
      if (window.scrollY < 200) setActiveSection('');
    };
    window.addEventListener('scroll', clearOnTop, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', clearOnTop);
    };
  }, [isSecondaryPage, anchorIds]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
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
          {links.map((link) => {
            const isActive = !isSecondaryPage && Boolean(activeSection) && link.href === `#${activeSection}`;
            return (
              <a
                key={link.href}
                href={isSecondaryPage ? normalizeFromSecondaryRoute(link.href) : link.href}
                aria-current={isActive ? 'true' : undefined}
                className={`relative px-3 py-2 font-sans text-[14px] font-medium transition-colors hover:text-white ${
                  isActive ? 'text-white' : 'text-white/65'
                }`}
              >
                <span className="link-reveal">{link.label}</span>
                {isActive ? (
                  <motion.span
                    layoutId="nav-active-indicator"
                    transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                    className="absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-brand-purple to-brand-lavender"
                  />
                ) : null}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          {ctaLabel && resolvedCtaHref ? (
            <motion.a
              href={resolvedCtaHref}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
              className="btn-sheen hidden sm:inline-flex group items-center gap-2.5 rounded-full bg-bone-50 px-5 py-2.5 text-[13px] font-medium text-ink-950 hover:bg-brand-mist transition-colors"
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

      {/* Barra de progreso de lectura, pegada al borde inferior del header */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-lavender transition-opacity duration-500 ${
          scrolled ? 'opacity-80' : 'opacity-0'
        }`}
      />
    </header>

    {/* Overlay + drawer viven FUERA del <header>: el backdrop-blur del header
        al scrollear crea un containing block y rompe el `fixed` de sus hijos
        (el drawer quedaba recortado/detrás del contenido). Van por encima del
        header (z-55/60), por eso el drawer trae su propia cruz de cierre. */}
      <AnimatePresence>
        {open && hasMobileMenu ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-[55] bg-ink-950/70 backdrop-blur-sm"
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
            className="md:hidden fixed inset-y-0 right-0 z-[60] flex w-[78%] max-w-sm flex-col overflow-hidden border-l border-white/10 bg-ink-950/98 backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-purple/12 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-indigo/10 blur-[120px]" />
            <div className="pointer-events-none absolute inset-0 grid-bg-soft opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />

            <motion.button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: EASE_OUT_EXPO }}
              whileTap={{ scale: 0.88 }}
              className="absolute right-5 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white/70 transition-colors duration-300 hover:border-white/35 hover:text-white active:bg-white/[0.06]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </motion.button>

            <div className="eyebrow relative px-7 pt-24 pb-4">
              <span className="h-px w-6 bg-brand-purple/50" />
              Menú
            </div>

            <nav className="relative flex flex-1 flex-col overflow-y-auto px-7 pb-6">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 + i * 0.05, ease: EASE_OUT_EXPO }}
                  href={isSecondaryPage ? normalizeFromSecondaryRoute(link.href) : link.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between gap-4 border-b border-white/8 py-5 active:bg-white/[0.03] transition-colors"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] tabular-nums text-brand-purple/60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="display-md text-[1.9rem] leading-none text-white/90 transition-colors group-hover:text-white">
                      {link.label}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 text-sm text-white/35 transition-all duration-300 group-hover:border-brand-lavender/60 group-hover:bg-brand-purple/10 group-hover:text-brand-lavender group-active:scale-90"
                  >
                    →
                  </span>
                </motion.a>
              ))}

              {sectionAnchors.length ? (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.12 + links.length * 0.05, ease: EASE_OUT_EXPO }}
                  className="mt-9"
                >
                  <div className="mb-3.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
                    Explorar
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {sectionAnchors.map((anchor) => (
                      <a
                        key={anchor.href}
                        href={isSecondaryPage ? normalizeFromSecondaryRoute(anchor.href) : anchor.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/65 transition-colors active:bg-white/[0.06] active:text-white"
                      >
                        {anchor.label}
                        <span aria-hidden className="text-brand-purple/50">#</span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + links.length * 0.05, ease: EASE_OUT_EXPO }}
              className="relative border-t border-white/8 px-7 pb-7 pt-5"
            >
              <div className="mb-4 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/90">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Disponibles para nuevos proyectos
              </div>
              {ctaLabel && resolvedCtaHref ? (
                <a
                  href={resolvedCtaHref}
                  onClick={() => setOpen(false)}
                  className="btn-primary btn-sheen w-full justify-center py-3.5"
                >
                  {ctaLabel} →
                </a>
              ) : null}
              <div className="mt-5 flex items-center justify-between gap-4">
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 transition-colors hover:text-white/70"
                  >
                    {email}
                  </a>
                ) : null}
                {socials.length ? (
                  <div className="flex shrink-0 items-center gap-4">
                    {socials.map((social) => (
                      <a
                        key={social.url}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45 transition-colors hover:text-brand-lavender"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

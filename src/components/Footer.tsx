import { motion } from 'framer-motion';
import { useLandingData } from '../content/LandingDataContext';
import { resolveNavLinksFromLayout } from '../lib/sections';
import { EASE_OUT_EXPO, viewportOnce } from '../lib/motion';

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

function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('598')) return digits;
  if (digits.startsWith('0') && digits.length >= 8) return `598${digits.slice(1)}`;
  if (digits.length === 8) return `598${digits}`;
  return digits;
}

function iconFor(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes('instagram')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    );
  }
  if (normalized.includes('linkedin')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export default function Footer() {
  const { config } = useLandingData();
  const socials = Array.isArray(config.footer?.socials)
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
  const isProjects = isSecondaryLocation();
  const brandHref = isProjects ? '/' : '#top';
  const navLinks = resolveNavLinksFromLayout(config);

  const email = trimmed(config.contact?.email);
  const location = trimmed(config.contact?.location);
  const whatsappNumber = normalizeWhatsAppNumber(trimmed(config.contact?.whatsappNumber));
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '';

  return (
    <footer
      className="sbg-footer relative border-t border-white/8 overflow-hidden bg-cover bg-bottom bg-no-repeat"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/75 to-ink-950/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent" />

      <div className="container-wide pt-20 md:pt-28 pb-16 relative">
        {/* CTA de cierre */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 1, ease: EASE_OUT_EXPO }}
          className="mb-16 md:mb-24 flex flex-col items-start gap-8 border-b border-white/8 pb-16 md:flex-row md:items-end md:justify-between"
        >
          <h2 className="display-md text-3xl sm:text-4xl md:text-5xl text-white max-w-2xl leading-[1.05]">
            ¿Tenés una idea o un problema{' '}
que vale la pena <span className="kw-mark">resolver</span>?
          </h2>
          <a
            href="/brief"
            className="group inline-flex shrink-0 items-center gap-2.5 rounded-full bg-bone-50 px-7 py-4 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-mist"
          >
            Empezar un proyecto
            <span aria-hidden className="transition-transform group-hover:translate-x-1.5">→</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
          className="grid grid-cols-12 gap-x-6 gap-y-12"
        >
          {/* Brand block */}
          <div className="col-span-12 lg:col-span-4">
            <a href={brandHref} className="flex items-center gap-3 group">
              <motion.img
                whileHover={{ rotate: -8, scale: 1.08 }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                src={BRAND_MARK_SRC}
                alt={`Logo de ${brandName || 'Tricode Studio'}`}
                className="h-9 w-auto object-contain"
              />
              {brandName ? (
                <div className="flex items-baseline gap-1.5 leading-none">
                  {brandTop ? (
                    <span className="font-sans text-base font-semibold tracking-tight text-white">
                      {brandTop}
                    </span>
                  ) : null}
                  {brandBottom ? (
                    <span className="font-sans text-base font-medium tracking-tight text-white/45">
                      {brandBottom}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </a>
            <p className="mt-6 max-w-xs text-sm text-white/55 leading-relaxed">
              Diseñamos y construimos productos digitales pensados para crecer.
              Si tenés una idea o un problema operativo, vale la pena conversarlo.
            </p>
          </div>

          {/* Navegación */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-5">
              Navegación
            </div>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors link-reveal"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          {(email || whatsappHref || location) ? (
            <div className="col-span-6 sm:col-span-4 lg:col-span-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-5">
                Contacto
              </div>
              <ul className="flex flex-col gap-3">
                {email ? (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm text-white/70 hover:text-white transition-colors link-reveal"
                    >
                      {email}
                    </a>
                  </li>
                ) : null}
                {whatsappHref ? (
                  <li>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-white/70 hover:text-white transition-colors link-reveal"
                    >
                      WhatsApp
                    </a>
                  </li>
                ) : null}
                {location ? (
                  <li className="text-sm text-white/45">{location}</li>
                ) : null}
              </ul>
            </div>
          ) : null}

          {/* Seguinos */}
          {socials.length ? (
            <div className="col-span-6 sm:col-span-4 lg:col-span-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-5">
                Seguinos
              </div>
              <ul className="flex flex-col gap-3">
                {socials.map((social) => (
                  <li key={`${social.label}-${social.url}`}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors group"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 group-hover:border-brand-purple/50 group-hover:bg-brand-purple/10 transition-colors">
                        {iconFor(social.label)}
                      </span>
                      <span className="link-reveal">{social.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </motion.div>

        <div className="mt-14 md:mt-20 flex flex-col-reverse items-center gap-3 border-t border-white/8 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {brandName || 'Tricode Studio'}. Todos los derechos reservados.
          </p>
          <a
            href="/privacidad"
            className="text-xs text-white/30 hover:text-white/55 transition-colors"
          >
            Política de privacidad
          </a>
        </div>
      </div>
    </footer>
  );
}

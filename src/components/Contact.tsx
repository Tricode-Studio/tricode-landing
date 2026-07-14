import { motion } from 'framer-motion';
import SplitText from './SplitText';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, viewportOnce } from '../lib/motion';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, '');
  if (!digits) {
    return '';
  }
  if (digits.startsWith('00')) {
    return digits.slice(2);
  }
  if (digits.startsWith('598')) {
    return digits;
  }
  if (digits.startsWith('0') && digits.length >= 8) {
    return `598${digits.slice(1)}`;
  }
  if (digits.length === 8) {
    return `598${digits}`;
  }
  return digits;
}

function IconBrief() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M9 4h6a2 2 0 0 1 2 2v0h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1v0a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 4h6v3H9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 12h8M8 15.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M19.05 4.91A10 10 0 0 0 4.1 18.09L3 22l4-1.05A10 10 0 1 0 19.05 4.91Zm-7.06 15.18a8.32 8.32 0 0 1-4.24-1.16l-.3-.18-2.37.62.63-2.31-.2-.32a8.34 8.34 0 1 1 6.48 3.35Zm4.78-6.24c-.26-.13-1.55-.77-1.79-.86s-.41-.13-.59.13-.68.86-.83 1.04-.31.2-.57.07a6.83 6.83 0 0 1-2-1.24 7.55 7.55 0 0 1-1.39-1.73c-.15-.26 0-.39.11-.52s.26-.31.39-.46a1.85 1.85 0 0 0 .26-.43.48.48 0 0 0 0-.46c-.07-.13-.59-1.42-.81-1.94s-.43-.45-.59-.45h-.51a1 1 0 0 0-.71.33A3 3 0 0 0 6.4 9.4a5.18 5.18 0 0 0 1.09 2.77 11.93 11.93 0 0 0 4.56 4 15.27 15.27 0 0 0 1.52.56 3.65 3.65 0 0 0 1.68.11 2.75 2.75 0 0 0 1.8-1.27 2.24 2.24 0 0 0 .15-1.27c-.06-.11-.23-.18-.49-.31Z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Contact() {
  const { config } = useLandingData();
  const sectionLabel = trimmed(config.contact?.sectionLabel);
  const titleTop = trimmed(config.contact?.titleTop);
  const titleHighlight = trimmed(config.contact?.titleHighlight);
  const description = trimmed(config.contact?.description);
  const whatsappNumber = trimmed(config.contact?.whatsappNumber);
  const whatsappText = trimmed(config.contact?.whatsappText);
  const email = trimmed(config.contact?.email);
  const secondaryCtaLabel = trimmed(config.contact?.secondaryCtaLabel) || 'Contacto por email';
  const emailSubject = trimmed(config.contact?.emailSubject);
  const emailBody = trimmed(config.contact?.emailBody);

  const normalizedWhatsappNumber = normalizeWhatsAppNumber(whatsappNumber);
  const whatsappHref =
    normalizedWhatsappNumber && whatsappText
      ? `https://wa.me/${encodeURIComponent(normalizedWhatsappNumber)}?text=${encodeURIComponent(whatsappText)}`
      : '';
  const secondaryCtaHref =
    trimmed(config.contact?.secondaryCtaHref) ||
    (email
      ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
      : '');

  const guarantees = ['10 preguntas precisas', 'Respuesta en 24h hábiles', 'Enfoque en negocio y producto'];

  return (
    <section
      id="contacto"
      className="relative py-32 md:py-44 border-t border-white/5 overflow-hidden"
    >
      <div
        className="sbg-contact absolute inset-0 bg-cover bg-center opacity-80"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/70 to-ink-950" />
      <div className="absolute inset-0 grid-bg opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[820px] rounded-full bg-brand-violet/15 blur-[160px] animate-pulse-slow" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-[140px]" />

      <div className="container-x relative">
        {/* Heading */}
        <div className="text-center max-w-4xl mx-auto">
          {sectionLabel ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
              className="eyebrow justify-center mb-7"
            >
              <span className="h-px w-8 bg-brand-purple/50" />
              {sectionLabel}
            </motion.div>
          ) : null}
          {(titleTop || titleHighlight) ? (
            <h2 className="display-xl text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[6rem] leading-[1]">
              {titleTop ? <SplitText as="span" text={titleTop} className="block text-white" /> : null}
              {titleHighlight ? (
                <SplitText
                  as="span"
                  text={titleHighlight}
                  className="block mt-1 text-white"
                  markWord="charla"
                  delay={0.2}
                />
              ) : null}
            </h2>
          ) : null}
          {description ? (
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.4 }}
              className="mt-8 text-base md:text-lg text-white/65 max-w-2xl mx-auto"
            >
              {description}
            </motion.p>
          ) : null}

          {/* Guarantee chips inline with hero copy */}
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[12px] uppercase tracking-[0.18em] text-white/55 reveal reveal-delay-2">
            {guarantees.map((g) => (
              <li key={g} className="inline-flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30">
                  <IconCheck />
                </span>
                {g}
              </li>
            ))}
          </ul>
        </div>

        {/* Action grid */}
        <div className="mt-16 md:mt-20 grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Primary: Brief */}
          <a
            href="/brief"
            className="group relative md:col-span-3 lg:col-span-3 overflow-hidden rounded-3xl border border-white/12 bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(99,102,241,0.18)_55%,rgba(139,92,246,0.22))] p-7 md:p-9 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_30px_90px_-30px_rgba(16,185,129,0.55)] reveal reveal-delay-3"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.25),transparent_60%)]" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl" />

            <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 text-[#fff] shadow-[0_10px_30px_-12px_rgba(16,185,129,0.9)]">
                <IconBrief />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-emerald-300/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Recomendado
                </div>
                <h3 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-white">
                  Completá el cuestionario estratégico
                </h3>
                <p className="mt-2 text-sm md:text-base text-white/65 max-w-xl">
                  10 preguntas clave para devolverte una propuesta realista con alcance, tiempos y costo.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md group-hover:bg-emerald-400 group-hover:text-emerald-950 group-hover:border-emerald-400 transition-all">
                Empezar
                <span className="transition-transform group-hover:translate-x-1">
                  <IconArrow />
                </span>
              </div>
            </div>
          </a>

          {/* WhatsApp */}
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/[0.04] reveal reveal-delay-3"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/30 transition-colors group-hover:bg-emerald-500 group-hover:text-[#fff]">
                  <IconWhatsApp />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/45">Respuesta rápida</div>
                  <h4 className="mt-1 text-lg font-semibold text-white">WhatsApp</h4>
                  <p className="mt-1 text-sm text-white/55">Charla directa, sin formularios.</p>
                </div>
              </div>
              <div className="relative mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 group-hover:text-white">
                Escribir ahora
                <span className="transition-transform group-hover:translate-x-1">
                  <IconArrow />
                </span>
              </div>
            </a>
          ) : null}

          {/* Email */}
          {secondaryCtaHref ? (
            <a
              href={secondaryCtaHref}
              target="_blank"
              rel="noreferrer"
              className="group relative md:col-span-2 lg:col-span-2 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/50 hover:bg-white/[0.04] reveal reveal-delay-4"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-violet/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-violet/15 text-brand-violet ring-1 ring-brand-violet/30 transition-colors group-hover:bg-brand-violet group-hover:text-[#fff]">
                  <IconMail />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/45">{secondaryCtaLabel}</div>
                  <h4 className="mt-1 text-lg font-semibold text-white truncate">
                    {email || 'Contacto por email'}
                  </h4>
                  <p className="mt-1 text-sm text-white/55">Para consultas más detalladas o adjuntar material.</p>
                </div>
              </div>
              <div className="relative mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 group-hover:text-white">
                Componer email
                <span className="transition-transform group-hover:translate-x-1">
                  <IconArrow />
                </span>
              </div>
            </a>
          ) : null}
        </div>

        {/* Footer micro-line */}
        <p className="mt-12 text-center text-xs uppercase tracking-[0.28em] text-white/35 reveal reveal-delay-4">
          Diagnóstico estratégico · Sin compromiso · Respuesta humana
        </p>
      </div>
    </section>
  );
}

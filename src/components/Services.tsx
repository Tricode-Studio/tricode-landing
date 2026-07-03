import { AnimatePresence, motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import SplitText from './SplitText';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from '../lib/motion';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function ServiceIcon({ index }: { index: number }) {
  const common = 'h-6 w-6';
  // Landing page
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 4h18v4H3zM3 12h12v8H3zM17 12h4v8h-4z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // Sitio institucional
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5a3 3 0 013-3 3 3 0 013 3v5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // Catálogos
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }
  // Comercio electrónico
  if (index === 3) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 6h18l-2 11H5L3 6zM3 6L2 3H1M9 21a1 1 0 100-2 1 1 0 000 2zM18 21a1 1 0 100-2 1 1 0 000 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // Sistemas de reservas
  if (index === 4) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // Blogs
  if (index === 5) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 13h6M9 17h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // Soluciones personalizadas (y cualquier servicio adicional futuro)
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MockupChrome({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900/85 backdrop-blur-2xl shadow-[0_50px_140px_-50px_rgba(139,92,246,0.5)] overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-ink-950/40">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <div className="flex-1 max-w-xs rounded-md bg-ink-950/80 border border-white/[0.06] px-3 py-1.5 font-mono text-[10px] text-white/50 truncate">
          {url}
        </div>
      </div>
      <div className="p-5 sm:p-6 min-h-[280px] flex flex-col justify-center">{children}</div>
    </div>
  );
}

function LandingMockup() {
  return (
    <MockupChrome url="tuproyecto.studio">
      <div className="space-y-2.5">
        <div className="h-2.5 w-24 rounded-full bg-brand-purple/40" />
        <div className="h-6 w-4/5 rounded-md bg-white/85" />
        <div className="h-6 w-3/5 rounded-md bg-white/40" />
      </div>
      <div className="mt-6 flex items-center gap-3">
        <span className="rounded-full bg-white/90 px-5 py-2.5 text-[11px] font-medium text-ink-950">
          Empezar ahora
        </span>
        <span className="text-[11px] text-white/40">Ver demo →</span>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-3">
        {['92%', '3.2x', '1.4s'].map((stat) => (
          <div key={stat} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="display-md text-lg text-white">{stat}</div>
            <div className="mt-1 h-1.5 w-3/4 rounded-full bg-white/15" />
          </div>
        ))}
      </div>
    </MockupChrome>
  );
}

function InstitutionalMockup() {
  return (
    <MockupChrome url="tuempresa.studio">
      <div className="flex items-center gap-5 mb-7 font-mono text-[9px] uppercase tracking-widest text-white/35">
        <span className="text-white/70">Nosotros</span>
        <span>Servicios</span>
        <span>Contacto</span>
      </div>
      <div className="space-y-2.5">
        <div className="h-2.5 w-24 rounded-full bg-brand-purple/40" />
        <div className="h-5 w-3/4 rounded-md bg-white/85" />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="h-6 w-6 rounded-lg bg-brand-purple/25" />
            <div className="mt-3 h-1.5 w-4/5 rounded-full bg-white/25" />
            <div className="mt-1.5 h-1.5 w-3/5 rounded-full bg-white/15" />
          </div>
        ))}
      </div>
    </MockupChrome>
  );
}

function CatalogMockup() {
  return (
    <MockupChrome url="catalogo.studio">
      <div className="flex items-center justify-between mb-4">
        <div className="h-2.5 w-24 rounded-full bg-white/30" />
        <div className="h-2 w-14 rounded-full bg-white/15" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div
              className={`aspect-square ${
                i % 4 === 0 ? 'bg-gradient-to-br from-brand-purple/25 to-brand-indigo/15' : 'bg-white/[0.04]'
              }`}
            />
            <div className="p-2">
              <div className="h-1.5 w-4/5 rounded-full bg-white/25" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-[11px] text-white/40">Sin checkout · consultá por WhatsApp</div>
    </MockupChrome>
  );
}

function BlogMockup() {
  return (
    <MockupChrome url="blog.studio/articulos">
      <div className="h-2.5 w-28 rounded-full bg-white/30 mb-5" />
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div
              className={`h-12 w-16 shrink-0 rounded-lg ${
                i === 0 ? 'bg-gradient-to-br from-brand-purple/30 to-brand-indigo/20' : 'bg-white/[0.05]'
              }`}
            />
            <div className="flex-1 space-y-1.5">
              <div className="h-1.5 w-3/4 rounded-full bg-white/30" />
              <div className="h-1.5 w-1/2 rounded-full bg-white/15" />
              <div className="h-1 w-1/4 rounded-full bg-brand-lavender/50" />
            </div>
          </div>
        ))}
      </div>
    </MockupChrome>
  );
}

function EcommerceMockup() {
  return (
    <MockupChrome url="tienda.studio/catalogo">
      <div className="flex items-center justify-between mb-4">
        <div className="h-2.5 w-20 rounded-full bg-white/30" />
        <div className="h-7 w-7 rounded-lg border border-white/10 bg-white/[0.03]" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div
              className={`aspect-square ${
                i % 3 === 0 ? 'bg-gradient-to-br from-brand-purple/30 to-brand-indigo/20' : 'bg-white/[0.04]'
              }`}
            />
            <div className="p-2 space-y-1.5">
              <div className="h-1.5 w-4/5 rounded-full bg-white/25" />
              <div className="h-1.5 w-1/2 rounded-full bg-brand-lavender/50" />
            </div>
          </div>
        ))}
      </div>
    </MockupChrome>
  );
}

function BookingMockup() {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const busy = [3, 8, 14, 19];
  return (
    <MockupChrome url="reservas.studio/agenda">
      <div className="grid grid-cols-7 gap-1.5 text-center mb-3">
        {days.map((day) => (
          <div key={day} className="font-mono text-[9px] uppercase tracking-widest text-white/35">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 21 }, (_, i) => i).map((slot) => (
          <div
            key={slot}
            className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-mono ${
              busy.includes(slot)
                ? 'bg-grad-brand text-white shadow-[0_0_12px_rgba(124,58,237,0.55)]'
                : 'border border-white/[0.06] bg-white/[0.02] text-white/25'
            }`}
          >
            {slot + 1}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-[11px] text-white/50">
        <span className="h-2 w-2 rounded-full bg-grad-brand" />
        Turno confirmado · próximo 14:30
      </div>
    </MockupChrome>
  );
}

function DashboardMockup() {
  const bars = [30, 55, 40, 70, 48, 85, 62];
  return (
    <MockupChrome url="panel.studio/operacion">
      <div className="flex items-center justify-between mb-5">
        <div className="h-2.5 w-28 rounded-full bg-white/30" />
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400/85">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          en vivo
        </div>
      </div>
      <div className="flex items-end gap-2 h-24">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-gradient-to-t from-brand-purple/70 to-brand-lavender/60"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-5 space-y-2">
        {['Integración con API interna', 'Automatización de tareas'].map((row) => (
          <div key={row} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-white/60">{row}</span>
          </div>
        ))}
      </div>
    </MockupChrome>
  );
}

function ServiceMockup({ index }: { index: number }) {
  if (index === 0) return <LandingMockup />;
  if (index === 1) return <InstitutionalMockup />;
  if (index === 2) return <CatalogMockup />;
  if (index === 3) return <EcommerceMockup />;
  if (index === 4) return <BookingMockup />;
  if (index === 5) return <BlogMockup />;
  return <DashboardMockup />;
}

export default function Services() {
  const { config } = useLandingData();
  const serviceBlock = (Array.isArray(config.services)
    ? { items: config.services }
    : config.services ?? {}) as {
    sectionLabel?: string;
    titleTop?: string;
    titleHighlight?: string;
    description?: string;
    items?: Array<{ title: string; desc: string; tag: string; audience: string }>;
  };
  const sectionLabel = trimmed(serviceBlock.sectionLabel);
  const titleTop = trimmed(serviceBlock.titleTop);
  const titleHighlight = trimmed(serviceBlock.titleHighlight);
  const description = trimmed(serviceBlock.description);
  const services = Array.isArray(serviceBlock.items)
    ? serviceBlock.items
        .map((service) => ({
          title: trimmed(service?.title),
          desc: trimmed(service?.desc),
          tag: trimmed(service?.tag),
          audience: trimmed(service?.audience),
        }))
        .filter((service) => service.title && service.desc)
    : [];

  const [active, setActive] = useState(0);
  const activeIndex = Math.min(active, Math.max(services.length - 1, 0));

  return (
    <section
      id="servicios"
      className="relative py-28 md:py-40 border-t border-white/5 overflow-hidden"
    >
      <div className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-brand-violet/10 blur-[160px]" />

      <div className="container-wide relative">
        <div className="max-w-4xl mb-16 md:mb-24">
          {sectionLabel ? (
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
              className="eyebrow mb-7"
            >
              <span className="h-px w-8 bg-brand-purple/50" />
              {sectionLabel}
            </motion.div>
          ) : null}

          {(titleTop || titleHighlight) ? (
            <h2 className="display-xl text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[5.5rem]">
              {titleTop ? <SplitText as="span" text={titleTop} className="block text-white" /> : null}
              {titleHighlight ? (
                <SplitText
                  as="span"
                  text={titleHighlight}
                  className="block mt-1"
                  wordClassName="italic-serif text-grad"
                  delay={0.2}
                />
              ) : null}
            </h2>
          ) : null}

          {description ? (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 }}
              className="mt-6 max-w-xl text-white/65 leading-relaxed text-base md:text-lg"
            >
              {description}
            </motion.p>
          ) : null}
        </div>

        {services.length ? (
          <motion.div
            variants={stagger(0.08, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid md:grid-cols-12 gap-x-8 gap-y-3"
          >
            {/* Tab triggers */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-2">
              {services.map((service, index) => {
                const isActive = index === activeIndex;
                return (
                  <motion.div key={service.title} variants={fadeUp}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      onMouseEnter={() => setActive(index)}
                      className={`group w-full flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-colors duration-400 ${
                        isActive
                          ? 'border-brand-purple/45 bg-white/[0.045]'
                          : 'border-transparent hover:border-white/10 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div
                        className={`shrink-0 h-12 w-12 rounded-xl border flex items-center justify-center transition-colors duration-400 ${
                          isActive
                            ? 'border-brand-purple/50 bg-grad-soft text-brand-purple'
                            : 'border-white/10 bg-white/[0.02] text-white/45'
                        }`}
                      >
                        <ServiceIcon index={index} />
                      </div>
                      <div className="min-w-0">
                        <h3 className={`text-lg font-medium truncate ${isActive ? 'text-white' : 'text-white/70'}`}>
                          {service.title}
                        </h3>
                        {service.tag ? (
                          <span className="mt-1 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/80">
                            <span className="h-1 w-1 rounded-full bg-emerald-400" />
                            {service.tag}
                          </span>
                        ) : null}
                      </div>
                      <span
                        aria-hidden
                        className={`md:hidden ml-auto shrink-0 text-white/40 transition-transform duration-400 ${
                          isActive ? 'rotate-90' : ''
                        }`}
                      >
                        →
                      </span>
                    </button>

                    {/* Mobile accordion body */}
                    <AnimatePresence initial={false}>
                      {isActive ? (
                        <motion.div
                          key="mobile-body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                          className="md:hidden overflow-hidden"
                        >
                          <div className="px-5 pt-4 pb-2">
                            <p className="text-white/70 leading-relaxed text-sm">{service.desc}</p>
                            {service.audience ? (
                              <p className="mt-3 text-xs text-white/40 font-mono leading-relaxed">
                                {service.audience}
                              </p>
                            ) : null}
                            <div className="mt-5">
                              <ServiceMockup index={index} />
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Desktop detail panel */}
            <div className="hidden md:block md:col-span-7 lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                >
                  <p className="text-white/70 leading-relaxed text-lg max-w-xl">
                    {services[activeIndex]?.desc}
                  </p>
                  {services[activeIndex]?.audience ? (
                    <p className="mt-3 text-xs text-white/40 font-mono leading-relaxed max-w-md">
                      {services[activeIndex].audience}
                    </p>
                  ) : null}
                  <div className="mt-7">
                    <ServiceMockup index={activeIndex} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

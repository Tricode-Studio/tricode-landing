import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState, type ReactNode } from 'react';
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
  // Catálogos
  if (index === 1) {
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
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 6h18l-2 11H5L3 6zM3 6L2 3H1M9 21a1 1 0 100-2 1 1 0 000 2zM18 21a1 1 0 100-2 1 1 0 000 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // Sistemas de reservas
  if (index === 3) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // Blogs (y cualquier servicio adicional futuro)
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13h6M9 17h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MockupChrome({
  url,
  children,
  noPadding = false,
}: {
  url: string;
  children: ReactNode;
  noPadding?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900/85 backdrop-blur-2xl shadow-panel overflow-hidden">
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
      <div className={noPadding ? '' : 'p-5 sm:p-6 min-h-[280px] flex flex-col justify-center'}>
        {children}
      </div>
    </div>
  );
}

function LandingEmbed() {
  return (
    <MockupChrome url="estudiovera.studio" noPadding>
      <iframe
        src="/mockups/landing/index.html"
        title="Landing de Estudio Vera"
        loading="lazy"
        className="h-[560px] w-full border-0"
      />
    </MockupChrome>
  );
}

function CatalogEmbed() {
  return (
    <MockupChrome url="marco.studio/catalogo" noPadding>
      <iframe
        src="/mockups/catalog/index.html"
        title="Catálogo de MARCO"
        loading="lazy"
        className="h-[560px] w-full border-0"
      />
    </MockupChrome>
  );
}

function BlogEmbed() {
  return (
    <MockupChrome url="tricode.studio/blog" noPadding>
      <iframe
        src="/mockups/blog/index.html"
        title="Blog de Tricode Studio"
        loading="lazy"
        className="h-[560px] w-full border-0"
      />
    </MockupChrome>
  );
}

function EcommerceEmbed() {
  return (
    <MockupChrome url="niebla.studio/tienda" noPadding>
      <iframe
        src="/mockups/ecommerce/index.html"
        title="Tienda de Niebla Café"
        loading="lazy"
        className="h-[560px] w-full border-0"
      />
    </MockupChrome>
  );
}

function BookingEmbed() {
  return (
    <MockupChrome url="raiz.studio/reservar" noPadding>
      <iframe
        src="/mockups/reservas/index.html"
        title="Reservas de RAÍZ"
        loading="lazy"
        className="h-[560px] w-full border-0"
      />
    </MockupChrome>
  );
}

function ServiceMockup({ index }: { index: number }) {
  if (index === 0) return <LandingEmbed />;
  if (index === 1) return <CatalogEmbed />;
  if (index === 2) return <EcommerceEmbed />;
  if (index === 3) return <BookingEmbed />;
  return <BlogEmbed />;
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

  // --- Auto-scroll del acordeón en mobile ---
  // Al tocar un servicio, el contenido se expande debajo del tab pero el
  // viewport queda donde estaba (a menudo mostrando solo el final del mock).
  // Se registra el índice tocado y, cuando termina la animación de expansión
  // (altura ya definitiva), se scrollea para dejar ese servicio arriba,
  // justo debajo del header fijo.
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pendingScrollIndex = useRef<number | null>(null);
  const isTouchLayout = () => window.matchMedia('(max-width: 767px)').matches;

  const selectService = (index: number) => {
    if (index !== activeIndex && isTouchLayout()) {
      pendingScrollIndex.current = index;
    }
    setActive(index);
  };

  const scrollToPendingItem = (index: number) => {
    if (pendingScrollIndex.current !== index || !isTouchLayout()) return;
    pendingScrollIndex.current = null;
    const el = itemRefs.current[index];
    if (!el) return;
    const headerOffset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <section
      id="servicios"
      className="sbg-services relative py-28 md:py-40 border-t border-white/5 overflow-hidden bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/55 to-ink-950" />

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
                  className="block mt-1 text-white"
                  markWord="construir"
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
                  <motion.div
                    key={service.title}
                    variants={fadeUp}
                    ref={(el: HTMLDivElement | null) => {
                      itemRefs.current[index] = el;
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => selectService(index)}
                      onMouseEnter={() => {
                        // Solo hover real: en touch, mouseenter dispara junto al
                        // tap y rompería la detección de "cambio por click".
                        if (window.matchMedia('(hover: hover)').matches) {
                          setActive(index);
                        }
                      }}
                      className={`group w-full flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-[color,background-color,border-color,transform] duration-400 active:scale-[0.99] ${
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
                          onAnimationComplete={() => scrollToPendingItem(index)}
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

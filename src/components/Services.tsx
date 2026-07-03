import { motion } from 'framer-motion';
import SplitText from './SplitText';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from '../lib/motion';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function ServiceIcon({ index }: { index: number }) {
  const variant = index % 4;
  const common = 'h-7 w-7';
  if (variant === 0) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 4h18v4H3zM3 12h12v8H3zM17 12h4v8h-4z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (variant === 1) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 6h18l-2 11H5L3 6zM3 6L2 3H1M9 21a1 1 0 100-2 1 1 0 000 2zM18 21a1 1 0 100-2 1 1 0 000 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (variant === 2) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
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

  return (
    <section
      id="servicios"
      className="relative py-28 md:py-40 border-t border-white/5 overflow-hidden"
    >
      <div className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-brand-violet/10 blur-[160px]" />

      <div className="container-wide relative">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-end mb-16 md:mb-24">
          <div className="col-span-12 lg:col-span-8">
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
          </div>
          {description ? (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 }}
              className="col-span-12 lg:col-span-4 text-white/65 leading-relaxed text-base md:text-lg"
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
            className="divide-y divide-white/10 border-t border-white/10"
          >
            {services.map((service, index) => (
              <motion.article
                key={service.title}
                variants={fadeUp}
                className="group relative py-10 md:py-14 grid grid-cols-12 gap-x-6 gap-y-5 items-start transition-colors duration-500 hover:bg-white/[0.015]"
              >
                {/* Hover spotlight */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-2 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-out bg-grad-brand opacity-70" />

                <div className="col-span-2 sm:col-span-1 lg:col-span-1 font-mono text-xs md:text-sm text-white/40">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="col-span-10 sm:col-span-11 lg:col-span-4 flex items-start gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-grad-soft border border-brand-purple/30 flex items-center justify-center text-brand-purple group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <ServiceIcon index={index} />
                  </div>
                  <div>
                    <h3 className="display-md text-2xl md:text-3xl text-white">
                      {service.title}
                    </h3>
                    {service.tag ? (
                      <span className="mt-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300/85">
                        <span className="h-1 w-1 rounded-full bg-emerald-400" />
                        {service.tag}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-5 text-white/70 leading-relaxed text-base md:text-lg">
                  {service.desc}
                </div>

                <div className="col-span-12 lg:col-span-2 lg:text-right">
                  {service.audience ? (
                    <p className="text-xs text-white/40 leading-relaxed font-mono">
                      {service.audience}
                    </p>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

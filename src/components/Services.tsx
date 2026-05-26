import Spotlight from './Spotlight';
import { useLandingData } from '../content/LandingDataContext';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function ServiceIcon({ index }: { index: number }) {
  const variant = index % 4;

  if (variant === 0) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 4h18v4H3zM3 12h12v8H3zM17 12h4v8h-4z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (variant === 1) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 6h18l-2 11H5L3 6zM3 6L2 3H1M9 21a1 1 0 100-2 1 1 0 000 2zM18 21a1 1 0 100-2 1 1 0 000 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (variant === 2) {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
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
  const services =
    Array.isArray(serviceBlock.items)
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
    <section id="servicios" className="relative py-24 md:py-32 border-t border-white/5">
      <div className="container-x">
        {sectionLabel ? <div className="label mb-4 reveal">{sectionLabel}</div> : null}
        {(titleTop || titleHighlight) ? (
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-3xl reveal reveal-delay-1">
            {titleTop}
            {titleHighlight ? (
              <>
                <br />
                <span className="text-grad">{titleHighlight}</span>
              </>
            ) : null}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-5 text-white/60 max-w-2xl reveal reveal-delay-2">{description}</p>
        ) : null}

        {services.length ? (
          <div className="mt-14 grid md:grid-cols-2 gap-5 auto-rows-fr">
            {services.map((service, index) => (
              <div key={`${service.title}-${index}`} className="reveal h-full" style={{ transitionDelay: `${index * 80}ms` }}>
                <Spotlight as="article" className="card card-hover p-7 group rounded-2xl h-full min-h-[280px] flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-xl bg-grad-soft border border-brand-purple/30 flex items-center justify-center text-brand-purple group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <ServiceIcon index={index} />
                    </div>
                    {service.tag ? (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80 border border-emerald-400/20 bg-emerald-400/5 rounded-full px-2.5 py-1">
                        {service.tag}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed flex-1">{service.desc}</p>
                  {service.audience ? (
                    <p className="mt-5 text-xs text-white/40 font-mono border-t border-white/5 pt-4">
                      {service.audience}
                    </p>
                  ) : null}
                </Spotlight>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

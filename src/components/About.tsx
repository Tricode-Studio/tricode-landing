import Spotlight from './Spotlight';
import { useLandingData } from '../content/LandingDataContext';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export default function About() {
  const { config } = useLandingData();
  const sectionLabel = trimmed(config.about?.sectionLabel);
  const titleTop = trimmed(config.about?.titleTop);
  const titleHighlight = trimmed(config.about?.titleHighlight);
  const description = trimmed(config.about?.description);
  const microStats =
    Array.isArray(config.about?.microStats)
      ? config.about.microStats
          .map((item) => ({
            k: trimmed(item?.k),
            v: trimmed(item?.v),
          }))
          .filter((item) => item.k && item.v)
      : [];
  const pillars =
    Array.isArray(config.about?.pillars)
      ? config.about.pillars
          .map((item) => ({
            icon: trimmed(item?.icon),
            title: trimmed(item?.title),
            desc: trimmed(item?.desc),
          }))
          .filter((item) => item.title && item.desc)
      : [];
  const quoteText = trimmed(config.about?.quote?.text);
  const quoteHighlight = trimmed(config.about?.quote?.highlight);

  return (
    <section id="nosotros" className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="max-w-3xl">
          {sectionLabel ? <div className="label mb-4 reveal">{sectionLabel}</div> : null}
          {(titleTop || titleHighlight) ? (
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight reveal reveal-delay-1">
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
            <p className="mt-6 text-white/60 text-base md:text-lg reveal reveal-delay-2">{description}</p>
          ) : null}

          {microStats.length ? (
            <div className="mt-8 flex flex-wrap gap-x-6 sm:gap-x-10 gap-y-4 reveal reveal-delay-3">
              {microStats.map((stat, index) => (
                <div key={`${stat.v}-${index}`} className="border-l border-brand-purple/30 pl-3">
                  <div className="text-2xl md:text-3xl font-light text-grad leading-none">{stat.k}</div>
                  <div className="mt-1 text-[10px] md:text-xs text-white/50 font-mono uppercase tracking-wider">
                    {stat.v}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {pillars.length ? (
          <div className="mt-14 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((pillar, index) => (
              <div key={`${pillar.title}-${index}`} className="reveal" style={{ transitionDelay: `${index * 80}ms` }}>
                <Spotlight as="div" className="card card-hover h-full p-6 rounded-2xl">
                  {pillar.icon ? <div className="text-2xl text-brand-purple leading-none">{pillar.icon}</div> : null}
                  <div className="mt-4 font-medium text-white">{pillar.title}</div>
                  <div className="mt-2 text-sm text-white/55 leading-relaxed">{pillar.desc}</div>
                </Spotlight>
              </div>
            ))}
          </div>
        ) : null}

        {quoteText || quoteHighlight ? (
          <div className="mt-16 md:mt-24 max-w-4xl mx-auto text-center reveal">
            <svg
              className="mx-auto h-8 w-8 text-brand-purple/70"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M9.13 8.05c-3.16.6-5.2 3-5.2 6.16 0 2.4 1.45 3.79 3.27 3.79 1.66 0 2.93-1.27 2.93-2.97 0-1.55-1.06-2.7-2.55-2.7-.32 0-.71.07-.79.07.22-1.59 1.78-3.43 3.55-4.4l-1.21.05zm9.07 0c-3.16.6-5.2 3-5.2 6.16 0 2.4 1.45 3.79 3.27 3.79 1.66 0 2.93-1.27 2.93-2.97 0-1.55-1.06-2.7-2.55-2.7-.32 0-.71.07-.79.07.22-1.59 1.78-3.43 3.55-4.4l-1.21.05z" />
            </svg>
            <blockquote className="mt-5 text-xl md:text-2xl lg:text-3xl leading-snug text-white/90 italic font-light">
              {quoteText}
              {quoteHighlight ? (
                <>
                  {' '}
                  <span className="text-grad not-italic font-medium">{quoteHighlight}</span>
                </>
              ) : null}
            </blockquote>
          </div>
        ) : null}
      </div>
    </section>
  );
}

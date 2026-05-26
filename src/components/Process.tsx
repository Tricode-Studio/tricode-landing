import { useLandingData } from '../content/LandingDataContext';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export default function Process() {
  const { config } = useLandingData();
  const sectionLabel = trimmed(config.process?.sectionLabel);
  const titleTop = trimmed(config.process?.titleTop);
  const titleHighlight = trimmed(config.process?.titleHighlight);
  const description = trimmed(config.process?.description);
  const steps =
    Array.isArray(config.process?.steps)
      ? config.process.steps
          .map((step, index) => ({
            n: trimmed(step?.n) || String(index + 1).padStart(2, '0'),
            title: trimmed(step?.title),
            desc: trimmed(step?.desc),
          }))
          .filter((step) => step.title && step.desc)
      : [];

  return (
    <section id="proceso" className="relative py-24 md:py-32 border-t border-white/5">
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
        {description ? <p className="mt-5 text-white/60 max-w-2xl reveal reveal-delay-2">{description}</p> : null}

        {steps.length ? (
          <div className="mt-16 relative">
            <div className="absolute left-0 right-0 top-7 h-px bg-gradient-to-r from-transparent via-brand-purple/30 to-transparent hidden md:block" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-6">
              {steps.map((step, index) => (
                <div
                  key={`${step.n}-${index}`}
                  className="text-center md:text-left relative reveal group"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="mx-auto md:mx-0 mb-4 h-14 w-14 rounded-full border border-brand-purple/30 bg-ink-900 flex items-center justify-center font-mono text-sm text-brand-purple shadow-glow-sm group-hover:bg-grad-brand group-hover:text-white group-hover:border-transparent group-hover:scale-110 transition-all duration-300">
                    {step.n}
                  </div>
                  <div className="font-semibold">{step.title}</div>
                  <p className="mt-2 text-xs text-white/50 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

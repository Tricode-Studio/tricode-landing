import { useLandingData } from '../content/LandingDataContext';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export default function Faq() {
  const { config } = useLandingData();
  const faqBlock = config.faq ?? {};
  const sectionLabel = trimmed(faqBlock.sectionLabel);
  const titleTop = trimmed(faqBlock.titleTop);
  const titleHighlight = trimmed(faqBlock.titleHighlight);
  const description = trimmed(faqBlock.description);
  const items = Array.isArray(faqBlock.items)
    ? faqBlock.items
        .map((item) => ({
          question: trimmed(item?.question),
          answer: trimmed(item?.answer),
        }))
        .filter((item) => item.question && item.answer)
    : [];

  if (!items.length && !titleTop && !titleHighlight && !description) {
    return null;
  }

  return (
    <section id="faq" className="relative py-24 md:py-32 border-t border-white/5">
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

        {items.length ? (
          <div className="mt-10 md:mt-12 space-y-3">
            {items.map((item, index) => (
              <details
                key={`${item.question}-${index}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6 reveal"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <summary className="list-none cursor-pointer flex items-start justify-between gap-4">
                  <h3 className="text-base md:text-lg font-semibold text-white">{item.question}</h3>
                  <span
                    aria-hidden
                    className="mt-1 text-brand-purple text-xl leading-none transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm md:text-base text-white/65 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

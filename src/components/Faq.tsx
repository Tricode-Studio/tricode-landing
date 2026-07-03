import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplitText from './SplitText';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, viewportOnce } from '../lib/motion';

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

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!items.length && !titleTop && !titleHighlight && !description) {
    return null;
  }

  return (
    <section
      id="faq"
      className="relative py-28 md:py-40 border-t border-white/5 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-section03.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/55 to-ink-950" />
      <div className="absolute bottom-1/4 left-0 h-[360px] w-[360px] rounded-full bg-brand-violet/10 blur-[140px]" />

      <div className="container-wide relative">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 lg:col-span-5">
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
              <h2 className="display-xl text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
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
                className="mt-8 text-white/65 leading-relaxed text-base md:text-lg max-w-md"
              >
                {description}
              </motion.p>
            ) : null}
          </div>

          {items.length ? (
            <div className="col-span-12 lg:col-span-7">
              <div className="border-t border-white/10">
                {items.map((item, index) => {
                  const isOpen = openIdx === index;
                  return (
                    <motion.div
                      key={`${item.question}-${index}`}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={viewportOnce}
                      transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: index * 0.04 }}
                      className="border-b border-white/10"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenIdx(isOpen ? null : index)}
                        className="w-full flex items-start justify-between gap-6 py-6 md:py-7 text-left group"
                      >
                        <div className="flex items-start gap-5">
                          <span className="font-mono text-[11px] text-white/35 mt-1.5">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <h3 className="text-lg md:text-xl text-white/90 group-hover:text-white transition-colors">
                            {item.question}
                          </h3>
                        </div>
                        <motion.span
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                          className="text-2xl leading-none text-brand-purple shrink-0 mt-0.5"
                          aria-hidden
                        >
                          +
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                            className="overflow-hidden"
                          >
                            <p className="pl-12 pr-4 pb-6 md:pb-8 text-white/65 leading-relaxed text-base md:text-lg max-w-2xl">
                              {item.answer}
                            </p>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

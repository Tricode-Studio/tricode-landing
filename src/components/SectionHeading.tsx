import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportOnce } from '../lib/motion';
import SplitText from './SplitText';

type Props = {
  eyebrow?: string;
  titleTop?: string;
  titleHighlight?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  highlightAs?: 'serif' | 'gradient' | 'both';
};

export default function SectionHeading({
  eyebrow,
  titleTop,
  titleHighlight,
  description,
  align = 'left',
  className = '',
  highlightAs = 'both',
}: Props) {
  const alignClasses = align === 'center' ? 'text-center mx-auto items-center' : 'text-left';

  return (
    <motion.div
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={`flex flex-col gap-5 max-w-3xl ${alignClasses} ${className}`}
    >
      {eyebrow ? (
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-brand-purple/85"
        >
          <span className="h-px w-8 bg-brand-purple/50" />
          {eyebrow}
        </motion.div>
      ) : null}

      {(titleTop || titleHighlight) ? (
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] leading-[1] tracking-tight font-light">
          {titleTop ? (
            <SplitText
              as="span"
              text={titleTop}
              className="block text-white"
            />
          ) : null}
          {titleHighlight ? (
            <SplitText
              as="span"
              text={titleHighlight}
              className={`block mt-1 ${
                highlightAs === 'gradient'
                  ? 'text-grad'
                  : highlightAs === 'serif'
                  ? 'italic text-white/90'
                  : 'italic text-grad'
              }`}
              delay={0.18}
            />
          ) : null}
        </h2>
      ) : null}

      {description ? (
        <motion.p
          variants={fadeUp}
          className={`mt-1 text-base md:text-lg text-white/60 leading-relaxed ${
            align === 'center' ? 'mx-auto' : ''
          } max-w-2xl`}
        >
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

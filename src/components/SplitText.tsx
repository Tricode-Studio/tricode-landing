import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { stagger, viewportOnce, wordReveal } from '../lib/motion';

type Props = {
  text: string;
  className?: string;
  wordClassName?: string;
  /** Palabra clave a subrayar (violeta). Se compara sin puntuación ni mayúsculas. */
  markWord?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  once?: boolean;
};

function normalizeToken(value: string) {
  return value.replace(/[.,;:!?¿¡"'()]/g, '').toLowerCase();
}

export default function SplitText({
  text,
  className = '',
  wordClassName = '',
  markWord,
  delay = 0,
  as = 'span',
  once = true,
}: Props) {
  const words = text.split(' ').filter(Boolean);
  const MotionTag = motion[as] as typeof motion.span;
  const markTokens = markWord ? markWord.split(' ').map(normalizeToken).filter(Boolean) : [];

  return (
    <MotionTag
      className={className}
      variants={stagger(0.06, delay)}
      initial="hidden"
      whileInView="show"
      viewport={once ? viewportOnce : { amount: 0.3 }}
    >
      {words.map((word, index) => {
        const marked = markTokens.includes(normalizeToken(word));
        return (
          <Fragment key={`${word}-${index}`}>
            <span className="word-mask">
              <motion.span
                variants={wordReveal}
                className={`inline-block will-change-transform ${wordClassName} ${marked ? 'kw-mark' : ''}`}
              >
                {word}
              </motion.span>
            </span>
            {index < words.length - 1 ? ' ' : ''}
          </Fragment>
        );
      })}
    </MotionTag>
  );
}

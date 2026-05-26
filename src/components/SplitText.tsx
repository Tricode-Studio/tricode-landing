import { motion } from 'framer-motion';
import { stagger, viewportOnce, wordReveal } from '../lib/motion';

type Props = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  once?: boolean;
};

export default function SplitText({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  as = 'span',
  once = true,
}: Props) {
  const words = text.split(' ').filter(Boolean);
  const MotionTag = motion[as] as typeof motion.span;

  return (
    <MotionTag
      className={className}
      variants={stagger(0.06, delay)}
      initial="hidden"
      whileInView="show"
      viewport={once ? viewportOnce : { amount: 0.3 }}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="word-mask"
        >
          <motion.span
            variants={wordReveal}
            className={`inline-block will-change-transform ${wordClassName}`}
          >
            {word}
            {index < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

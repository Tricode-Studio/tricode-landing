import type { Transition, Variants } from 'framer-motion';

export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
};

export const stagger = (delay = 0.08, initial = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: delay, delayChildren: initial },
  },
});

export const wordReveal: Variants = {
  hidden: { y: '110%', opacity: 0 },
  show: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

export const letterReveal: Variants = {
  hidden: { y: '120%', opacity: 0 },
  show: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

export const viewportOnce = { once: true, amount: 0.2 } as const;

export const springSoft: Transition = { type: 'spring', stiffness: 120, damping: 18, mass: 0.6 };

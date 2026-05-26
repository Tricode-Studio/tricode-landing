import { ReactNode, useRef, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
  target?: string;
  rel?: string;
  ariaLabel?: string;
};

export default function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  strength = 0.35,
  target,
  rel,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const sharedProps = {
    ref: ref as never,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    style: { x: sx, y: sy },
    className: `relative inline-flex items-center justify-center will-change-transform ${className}`,
  };

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onClick={onClick}
        {...sharedProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} aria-label={ariaLabel} {...sharedProps}>
      {children}
    </motion.button>
  );
}

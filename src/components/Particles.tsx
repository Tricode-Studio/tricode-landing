import { useMemo } from 'react';

type Props = { count?: number };

export default function Particles({ count = 18 }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        size: 2 + Math.random() * 5,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 6,
        opacity: 0.25 + Math.random() * 0.5,
      })),
    [count],
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle animate-float"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

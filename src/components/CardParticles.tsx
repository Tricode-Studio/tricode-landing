import { useMemo } from 'react';

type Props = { count?: number };

export default function CardParticles({ count = 10 }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        size: 2 + Math.random() * 3,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2.5,
        duration: 2.8 + Math.random() * 2.4,
      })),
    [count],
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      aria-hidden
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle animate-float"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

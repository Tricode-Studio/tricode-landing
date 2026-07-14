import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

// Frase de marca. Cada palabra se ilumina a medida que la sección cruza el
// viewport (scroll-linked). Monocromo y editorial, sin color de relleno.
const WORDS =
  'No entregamos una web y desaparecemos. Construimos producto que trabaja para tu negocio, y crece con vos.'.split(
    ' ',
  );

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: ReactNode;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

export default function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.55'],
  });

  return (
    <section className="relative py-28 md:py-44 border-t border-white/5 overflow-hidden">
      <div className="absolute -top-24 left-1/2 h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-brand-purple/8 blur-[170px]" />
      <div ref={ref} className="container-wide relative">
        <div className="eyebrow mb-8">
          <span className="h-px w-8 bg-brand-purple/50" />
          Nuestra forma de trabajar
        </div>
        <p className="display-md text-[2rem] xs:text-4xl sm:text-5xl md:text-6xl lg:text-[4.6rem] leading-[1.12] text-white max-w-[62rem]">
          {WORDS.map((word, index) => {
            const start = index / WORDS.length;
            const end = start + 1 / WORDS.length;
            return (
              <Word key={`${word}-${index}`} progress={scrollYProgress} range={[start, end]}>
                {`${word} `}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
}

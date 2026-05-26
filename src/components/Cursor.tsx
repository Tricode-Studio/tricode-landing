import { useEffect, useRef } from 'react';

export default function Cursor() {
  const blob = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.body.classList.add('has-custom-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let bx = mx, by = my, rx = mx, ry = my;
    let raf = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const interactiveSelector = 'a, button, [data-cursor="hover"]';
    const onOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(interactiveSelector)) {
        blob.current?.classList.add('is-active');
        ring.current?.classList.add('is-active');
      }
    };
    const onOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(interactiveSelector)) {
        blob.current?.classList.remove('is-active');
        ring.current?.classList.remove('is-active');
      }
    };

    const tick = () => {
      bx += (mx - bx) * 0.25;
      by += (my - by) * 0.25;
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      if (blob.current) blob.current.style.transform = `translate(${bx}px, ${by}px) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div ref={blob} className="cursor-blob" aria-hidden />
      <div ref={ring} className="cursor-ring" aria-hidden />
    </>
  );
}

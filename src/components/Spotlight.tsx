import { useRef, ReactNode, MouseEvent } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section' | 'li';
};

export default function Spotlight({ children, className = '', as = 'div' }: Props) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mx', `${x}%`);
    el.style.setProperty('--my', `${y}%`);
  };

  const Tag = as as any;
  return (
    <Tag
      ref={ref as any}
      onMouseMove={onMove}
      className={`spotlight conic-border ${className}`}
    >
      {children}
    </Tag>
  );
}

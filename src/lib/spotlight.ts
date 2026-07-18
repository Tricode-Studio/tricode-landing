import type { MouseEvent } from 'react';

// Setea --mx/--my (px relativos al elemento) que consume el glow de `.spot-card`
// en index.css. Usar como onMouseMove en cualquier card con esa clase.
export function trackSpotlight(event: MouseEvent<HTMLElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  el.style.setProperty('--my', `${event.clientY - rect.top}px`);
}

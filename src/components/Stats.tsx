import Counter from './Counter';
import { useLandingData } from '../content/LandingDataContext';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export default function Stats() {
  const { config } = useLandingData();
  const stats = Array.isArray(config.stats)
    ? config.stats
        .map((item) => ({
          value: typeof item?.value === 'number' ? item.value : Number.NaN,
          prefix: trimmed(item?.prefix),
          suffix: trimmed(item?.suffix),
          label: trimmed(item?.label),
        }))
        .filter((item) => Number.isFinite(item.value) && item.label)
    : [];

  if (!stats.length) {
    return null;
  }

  return (
    <section id="stats" className="relative py-16 border-b border-white/5">
      <div className="container-x">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={`${stat.label}-${index}`}
              className="text-center reveal"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl sm:text-5xl md:text-7xl font-light text-grad flex items-baseline justify-center leading-none tabular-nums">
                {stat.prefix ? <span>{stat.prefix}</span> : null}
                <Counter to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs md:text-sm text-white/50 font-mono uppercase tracking-wider px-1 sm:px-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

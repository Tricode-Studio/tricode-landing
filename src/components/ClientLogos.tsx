import { motion } from 'framer-motion';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from '../lib/motion';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

type ResolvedLogo = {
  name: string;
  src: string;
  url: string;
};

function LogoMark({ logo }: { logo: ResolvedLogo }) {
  // Con archivo de logo: imagen grayscale que toma color en hover.
  // Sin archivo (fallback): el nombre como wordmark tipográfico -- se ve
  // intencional, no un placeholder roto, mientras se cargan los reales.
  const content = logo.src ? (
    <img
      src={logo.src}
      alt={logo.name}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="h-7 md:h-8 w-auto object-contain opacity-55 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
    />
  ) : (
    <span className="font-serif text-lg md:text-xl tracking-tight text-white/45 transition-colors duration-500 group-hover:text-white/85">
      {logo.name}
    </span>
  );

  if (logo.url) {
    return (
      <a
        href={logo.url}
        target="_blank"
        rel="noreferrer"
        aria-label={logo.name}
        className="group inline-flex items-center justify-center"
      >
        {content}
      </a>
    );
  }

  return <span className="group inline-flex items-center justify-center">{content}</span>;
}

export default function ClientLogos() {
  const { config } = useLandingData();
  const sectionLabel = trimmed(config.clients?.sectionLabel);
  const title = trimmed(config.clients?.title);
  const logos: ResolvedLogo[] = Array.isArray(config.clients?.logos)
    ? config.clients.logos
        .map((logo) => ({
          name: trimmed(logo?.name),
          src: trimmed(logo?.src),
          url: trimmed(logo?.url),
        }))
        .filter((logo) => logo.name || logo.src)
    : [];

  if (!logos.length) {
    return null;
  }

  return (
    <section id="clientes" className="relative py-16 md:py-20 border-b border-white/5 overflow-hidden">
      <div className="container-wide relative">
        {(sectionLabel || title) ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="text-center mb-10 md:mb-12"
          >
            {sectionLabel ? (
              <div className="eyebrow justify-center mb-4">
                <span className="h-px w-8 bg-brand-purple/50" />
                {sectionLabel}
                <span className="h-px w-8 bg-brand-purple/50" />
              </div>
            ) : null}
            {title ? (
              <p className="text-sm md:text-base text-white/55 max-w-xl mx-auto">{title}</p>
            ) : null}
          </motion.div>
        ) : null}

        <motion.div
          variants={stagger(0.08, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16"
        >
          {logos.map((logo, index) => (
            <motion.div key={`${logo.name}-${index}`} variants={fadeUp}>
              <LogoMark logo={logo} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

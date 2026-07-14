import { motion } from 'framer-motion';
import SplitText from './SplitText';
import { useLandingData } from '../content/LandingDataContext';
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from '../lib/motion';

function trimmed(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export default function Team() {
  const { config } = useLandingData();
  const sectionLabel = trimmed(config.team?.sectionLabel);
  const titleTop = trimmed(config.team?.titleTop);
  const titleHighlight = trimmed(config.team?.titleHighlight);
  const description = trimmed(config.team?.description);
  const members = Array.isArray(config.team?.members)
    ? config.team.members
        .map((member) => ({
          name: trimmed(member?.name),
          role: trimmed(member?.role),
          bio: trimmed(member?.bio),
        }))
        .filter((member) => member.name)
    : [];

  if (!members.length) {
    return null;
  }

  return (
    <section id="equipo" className="relative py-24 md:py-36 border-t border-white/5 overflow-hidden">
      <div className="absolute top-0 right-1/4 h-[420px] w-[420px] rounded-full bg-brand-indigo/8 blur-[170px]" />

      <div className="container-wide relative">
        <div className="max-w-3xl mb-14 md:mb-20">
          {sectionLabel ? (
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
              className="eyebrow mb-7"
            >
              <span className="h-px w-8 bg-brand-purple/50" />
              {sectionLabel}
            </motion.div>
          ) : null}

          {(titleTop || titleHighlight) ? (
            <h2 className="display-xl text-[2.4rem] sm:text-5xl md:text-6xl">
              {titleTop ? <SplitText as="span" text={titleTop} className="block text-white" /> : null}
              {titleHighlight ? (
                <SplitText
                  as="span"
                  text={titleHighlight}
                  className="block mt-1 text-white"
                  markWord="código"
                  delay={0.2}
                />
              ) : null}
            </h2>
          ) : null}

          {description ? (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 }}
              className="mt-6 text-white/60 leading-relaxed text-base md:text-lg"
            >
              {description}
            </motion.p>
          ) : null}
        </div>

        <motion.div
          variants={stagger(0.1, 0.15)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {members.map((member, index) => (
            <motion.article
              key={member.name}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-7 transition-all duration-500 hover:border-brand-purple/40 hover:bg-white/[0.04]"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] text-white/35">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-lavender/80">
                  {member.role}
                </span>
              </div>

              <h3 className="mt-8 display-md text-2xl md:text-[1.7rem] text-white leading-tight">
                {member.name}
              </h3>

              {member.bio ? (
                <p className="mt-4 text-sm text-white/55 leading-relaxed">{member.bio}</p>
              ) : null}

              <span className="mt-8 block h-px w-full bg-gradient-to-r from-brand-purple/40 via-white/10 to-transparent" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

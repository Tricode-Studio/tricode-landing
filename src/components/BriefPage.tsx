import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Nav from './Nav';
import Footer from './Footer';
import { submitPublicBudgetRequest } from '../lib/cms';
import { EASE_OUT_EXPO } from '../lib/motion';

type BriefFormState = {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  rubro: string;
  tipoProyecto: string;
  tipoAlcance: string;
  objetivoPrincipal: string;
  publicoObjetivo: string;
  funcionalidadClave: string;
  rangoPresupuesto: string;
  plazoDeseado: string;
};

const defaultState: BriefFormState = {
  nombre: '',
  email: '',
  telefono: '',
  empresa: '',
  rubro: '',
  tipoProyecto: 'Landing',
  tipoAlcance: '',
  objetivoPrincipal: '',
  publicoObjetivo: '',
  funcionalidadClave: '',
  rangoPresupuesto: '',
  plazoDeseado: '',
};

const STEPS = [
  { label: 'Sobre vos', hint: 'Para saber cómo y a quién responderle.' },
  { label: 'Tu proyecto', hint: 'Qué querés construir y en qué contexto.' },
  { label: 'Objetivos', hint: 'Qué tiene que lograr y para quién.' },
  { label: 'Inversión', hint: 'Para alinear alcance con realidad.' },
] as const;

const TOTAL_STEPS = STEPS.length;

const inputClass =
  'peer h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-[15px] text-white outline-none transition-all placeholder:text-white/30 hover:border-white/20 focus:border-emerald-400/70 focus:bg-white/[0.05] focus:ring-4 focus:ring-emerald-400/15';
const textareaClass =
  'peer min-h-[120px] w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-white outline-none transition-all placeholder:text-white/30 hover:border-white/20 focus:border-emerald-400/70 focus:bg-white/[0.05] focus:ring-4 focus:ring-emerald-400/15';

function emailIsValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
  filled: boolean;
  optional?: boolean;
  hint?: string;
  className?: string;
};

function Field({ label, children, filled, optional, hint, className }: FieldProps) {
  return (
    <div className={`group relative ${className ?? ''}`}>
      <div className="mb-2 flex items-center gap-2.5">
        <span
          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            filled
              ? 'bg-emerald-400 text-emerald-950 ring-2 ring-emerald-400/25'
              : 'border border-white/15 text-transparent'
          }`}
        >
          <CheckIcon />
        </span>
        <label className="text-[13.5px] font-medium text-white/85">{label}</label>
        {optional ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">opcional</span>
        ) : null}
      </div>
      {children}
      {hint ? <p className="mt-1.5 pl-[30px] text-[12px] text-white/40">{hint}</p> : null}
    </div>
  );
}

type SelectOption = { value: string; label: string };

type CustomSelectProps = {
  value: string;
  options: SelectOption[];
  placeholder: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function CustomSelect({ value, options, placeholder, onChange, required }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [highlight, setHighlight] = useState<number>(() => {
    const idx = options.findIndex((opt) => opt.value === value);
    return idx >= 0 ? idx : 0;
  });
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const estimatedHeight = Math.min(options.length * 44 + 16, 256) + 8;
    const spaceBelow = window.innerHeight - rect.bottom;
    setDropUp(spaceBelow < estimatedHeight && rect.top > estimatedHeight);
  }, [open, options.length]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  useEffect(() => {
    if (open && listRef.current) {
      const node = listRef.current.querySelector<HTMLElement>(`[data-idx="${highlight}"]`);
      node?.scrollIntoView({ block: 'nearest' });
    }
  }, [open, highlight]);

  const handleKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setHighlight((cur) => Math.min(options.length - 1, cur + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setHighlight((cur) => Math.max(0, cur - 1));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (open) {
        const opt = options[highlight];
        if (opt) {
          onChange(opt.value);
          setOpen(false);
        }
      } else {
        setOpen(true);
      }
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKey}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`peer flex h-12 w-full items-center justify-between rounded-xl border bg-white/[0.03] pl-4 pr-3 text-left text-[15px] outline-none transition-all hover:border-white/20 focus:ring-4 focus:ring-emerald-400/15 ${
          open ? 'border-emerald-400/70 bg-white/[0.05]' : 'border-white/10'
        }`}
      >
        <span className={selected ? 'text-white' : 'text-white/35'}>
          {selected ? selected.label : placeholder}
        </span>
        <span
          className={`grid h-7 w-7 place-items-center rounded-md text-white/55 transition-all ${
            open ? 'bg-emerald-400/15 text-emerald-300 rotate-180' : 'bg-white/[0.04]'
          }`}
        >
          <ChevronDown />
        </span>
      </button>

      {required ? (
        <input
          tabIndex={-1}
          aria-hidden
          required
          value={value}
          onChange={() => undefined}
          className="absolute left-4 bottom-2 h-px w-px opacity-0 pointer-events-none"
        />
      ) : null}

      {open ? (
        <ul
          ref={listRef}
          role="listbox"
          className={`surface-pop absolute z-40 max-h-64 w-full overflow-auto rounded-xl border border-white/12 p-1.5 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl ${
            dropUp ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          {options.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isHighlighted = idx === highlight;
            return (
              <li key={opt.value || `__placeholder_${idx}`} data-idx={idx}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlight(idx)}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] transition-colors ${
                    isHighlighted ? 'bg-emerald-400/12 text-white' : 'text-white/80 hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={isSelected ? 'font-medium' : ''}>
                    {opt.label || <span className="text-white/40">{placeholder}</span>}
                  </span>
                  {isSelected ? (
                    <span className="text-emerald-300">
                      <CheckIcon />
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function Stepper({
  current,
  isValid,
  canJumpTo,
  onJump,
}: {
  current: number;
  isValid: (step: number) => boolean;
  canJumpTo: (step: number) => boolean;
  onJump: (step: number) => void;
}) {
  return (
    <div className="w-full">
      <ol className="flex items-center">
        {STEPS.map((step, index) => {
          const done = isValid(index);
          const isCurrent = index === current;
          const reachable = canJumpTo(index);
          return (
            <li key={step.label} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => reachable && onJump(index)}
                disabled={!reachable}
                aria-current={isCurrent ? 'step' : undefined}
                className={`group flex flex-col items-center gap-2 ${reachable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full border text-[13px] font-semibold tabular-nums transition-all duration-300 ${
                    isCurrent
                      ? 'border-emerald-400 bg-emerald-400/15 text-emerald-200 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]'
                      : done
                        ? 'border-emerald-400/60 bg-emerald-400 text-emerald-950'
                        : 'border-white/15 bg-white/[0.03] text-white/45'
                  }`}
                >
                  {done && !isCurrent ? <CheckIcon /> : index + 1}
                  {isCurrent ? (
                    <span className="absolute -inset-0.5 rounded-full border border-emerald-400/40 animate-ping opacity-40" aria-hidden />
                  ) : null}
                </span>
                <span
                  className={`hidden sm:block text-[11px] font-mono uppercase tracking-[0.16em] transition-colors ${
                    isCurrent ? 'text-white' : done ? 'text-white/60' : 'text-white/35'
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {index < TOTAL_STEPS - 1 ? (
                <span className="relative mx-2 sm:mx-3 -mt-6 sm:-mt-7 h-px flex-1 overflow-hidden rounded-full bg-white/10">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-500"
                    style={{ width: isValid(index) ? '100%' : '0%' }}
                  />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SuccessPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      className="surface-card relative overflow-hidden rounded-3xl border border-emerald-400/25 p-8 md:p-14 text-center"
    >
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-80 rounded-full bg-emerald-400/20 blur-[100px]" />
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.6, ease: EASE_OUT_EXPO }}
        className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 text-[#fff] shadow-[0_15px_40px_-12px_rgba(16,185,129,0.9)]"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
          <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
      <h2 className="relative mt-7 display-md text-2xl md:text-4xl text-white">
        Cuestionario <span className="kw-mark">recibido</span>.
      </h2>
      <p className="relative mx-auto mt-4 max-w-md text-white/65 leading-relaxed">
        Gracias por el detalle. Lo revisamos y te contactamos en menos de{' '}
        <span className="text-white">24h hábiles</span> con una propuesta concreta de alcance,
        tiempos y costo.
      </p>
      <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a href="/" className="btn-primary">
          Volver al inicio
        </a>
        <a
          href="/proyectos"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/85 transition-colors hover:border-white/35 hover:bg-white/[0.04]"
        >
          Ver proyectos
          <span aria-hidden>→</span>
        </a>
      </div>
    </motion.div>
  );
}

export default function BriefPage() {
  const [formState, setFormState] = useState<BriefFormState>(defaultState);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isStepValid = useMemo(
    () => (target: number) => {
      const f = formState;
      if (target === 0) return f.nombre.trim().length > 1 && emailIsValid(f.email);
      if (target === 1) return !!f.tipoProyecto.trim() && !!f.tipoAlcance.trim() && !!f.rubro.trim();
      if (target === 2) return !!f.objetivoPrincipal.trim() && f.funcionalidadClave.trim().length > 2;
      if (target === 3) return !!f.rangoPresupuesto.trim() && !!f.plazoDeseado.trim();
      return false;
    },
    [formState],
  );

  const allValid = [0, 1, 2, 3].every((s) => isStepValid(s));
  const canJumpTo = (target: number) =>
    target <= step || Array.from({ length: target }, (_, i) => i).every(isStepValid);

  // Al cambiar de paso, subir al inicio de la tarjeta (no en el montaje inicial).
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const goNext = () => {
    if (!isStepValid(step)) return;
    setDir(1);
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  };
  const goBack = () => {
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  };
  const jumpTo = (target: number) => {
    if (!canJumpTo(target)) return;
    setDir(target > step ? 1 : -1);
    setStep(target);
  };

  const submit = async () => {
    setSending(true);
    setError(null);
    try {
      await submitPublicBudgetRequest({
        nombre: formState.nombre.trim(),
        email: formState.email.trim() || undefined,
        telefono: formState.telefono.trim() || undefined,
        empresa: formState.empresa.trim() || undefined,
        rubro: formState.rubro.trim() || undefined,
        tipoProyecto: formState.tipoProyecto.trim(),
        objetivo: [
          `Objetivo principal: ${formState.objetivoPrincipal.trim()}`,
          `Alcance: ${formState.tipoAlcance.trim()}`,
          `Público objetivo: ${formState.publicoObjetivo.trim()}`,
          `Funcionalidad clave: ${formState.funcionalidadClave.trim()}`,
        ]
          .filter((item) => !item.endsWith(': '))
          .join(' | '),
        rangoPresupuesto: formState.rangoPresupuesto.trim() || undefined,
        plazoDeseado: formState.plazoDeseado.trim() || undefined,
        funcionalidades: formState.funcionalidadClave ? [formState.funcionalidadClave.trim()] : [],
        referencia: formState.publicoObjetivo.trim() || '',
        aceptaContacto: true,
      });
      setDone(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error && requestError.message
          ? requestError.message
          : 'No pudimos enviar el cuestionario. Probá de nuevo o escribinos por WhatsApp.',
      );
    } finally {
      setSending(false);
    }
  };

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < TOTAL_STEPS - 1) {
      goNext();
      return;
    }
    if (allValid) void submit();
  };

  const update = <K extends keyof BriefFormState>(key: K, value: BriefFormState[K]) =>
    setFormState((cur) => ({ ...cur, [key]: value }));

  const stepVariants = {
    enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -40 : 40 }),
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Nav />

      <main className="pt-32 md:pt-40 pb-24 md:pb-32">
        <section className="relative">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-brand-violet/15 blur-[140px]" />
          <div className="container-x relative">
            <a
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors mb-8"
            >
              <span aria-hidden>←</span>
              Volver al inicio
            </a>

            <div className="label mb-4">{'// cuestionario de proyecto'}</div>
            <h1 className="display-xl text-[2.15rem] sm:text-5xl md:text-6xl text-white max-w-4xl leading-[1.04]">
              Una cotización clara,{' '}
en 4 <span className="kw-mark">pasos</span>.
            </h1>
            <p className="mt-6 text-white/62 max-w-2xl text-base md:text-lg">
              Nada de formularios eternos. Respondé de a poco y te devolvemos una propuesta concreta
              de alcance, tiempos y costo, sin suposiciones.
            </p>
          </div>
        </section>

        <section className="mt-12 md:mt-16">
          <div className="container-x">
            <div className="max-w-4xl mx-auto">
              {done ? (
                <SuccessPanel />
              ) : (
                <div
                  ref={cardRef}
                  className="surface-card relative scroll-mt-28 rounded-3xl border border-white/12 backdrop-blur-xl shadow-[0_30px_100px_-40px_rgba(99,102,241,0.65)]"
                >
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
                    <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-violet/15 blur-[100px]" />
                    <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />
                  </div>

                  {/* Stepper */}
                  <div className="relative border-b border-white/8 px-6 md:px-10 pt-7 pb-6">
                    <Stepper current={step} isValid={isStepValid} canJumpTo={canJumpTo} onJump={jumpTo} />
                    <div className="mt-6 flex items-baseline gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300/90">
                        Paso {step + 1} de {TOTAL_STEPS}
                      </span>
                      <span className="text-[13px] text-white/45">{STEPS[step].hint}</span>
                    </div>
                  </div>

                  <form className="relative p-6 md:p-10" onSubmit={onFormSubmit}>
                    <div className="min-h-[300px]">
                      <AnimatePresence mode="wait" custom={dir} initial={false}>
                        <motion.div
                          key={step}
                          custom={dir}
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                          className="grid gap-6"
                        >
                          {step === 0 ? (
                            <>
                              <Field label="¿Cuál es tu nombre completo?" filled={formState.nombre.trim().length > 1}>
                                <input
                                  className={inputClass}
                                  autoComplete="name"
                                  placeholder="Ej: Juan Pérez"
                                  value={formState.nombre}
                                  onChange={(e) => update('nombre', e.target.value)}
                                />
                              </Field>
                              <Field label="Email para enviarte la propuesta" filled={emailIsValid(formState.email)}>
                                <input
                                  type="email"
                                  className={inputClass}
                                  autoComplete="email"
                                  placeholder="nombre@empresa.com"
                                  value={formState.email}
                                  onChange={(e) => update('email', e.target.value)}
                                />
                              </Field>
                              <div className="grid md:grid-cols-2 gap-6">
                                <Field label="WhatsApp de contacto" filled={!!formState.telefono.trim()} optional>
                                  <input
                                    className={inputClass}
                                    autoComplete="tel"
                                    placeholder="+598 9X XXX XXX"
                                    value={formState.telefono}
                                    onChange={(e) => update('telefono', e.target.value)}
                                  />
                                </Field>
                                <Field label="Empresa o marca" filled={!!formState.empresa.trim()} optional>
                                  <input
                                    className={inputClass}
                                    autoComplete="organization"
                                    placeholder="Ej: Acme S.A."
                                    value={formState.empresa}
                                    onChange={(e) => update('empresa', e.target.value)}
                                  />
                                </Field>
                              </div>
                            </>
                          ) : null}

                          {step === 1 ? (
                            <>
                              <div className="grid md:grid-cols-2 gap-6">
                                <Field label="¿Qué tipo de proyecto necesitás?" filled={!!formState.tipoProyecto.trim()}>
                                  <CustomSelect
                                    value={formState.tipoProyecto}
                                    placeholder="Seleccionar tipo"
                                    onChange={(v) => update('tipoProyecto', v)}
                                    options={[
                                      { value: 'Landing', label: 'Landing page' },
                                      { value: 'Sitio institucional', label: 'Sitio institucional' },
                                      { value: 'E-commerce', label: 'E-commerce / tienda' },
                                      { value: 'Sistema de reservas', label: 'Sistema de reservas' },
                                      { value: 'Sistema interno', label: 'Sistema interno / panel' },
                                      { value: 'Automatización', label: 'Automatización' },
                                      { value: 'Otro', label: 'Otro' },
                                    ]}
                                  />
                                </Field>
                                <Field label="¿Es nuevo o una mejora?" filled={!!formState.tipoAlcance.trim()}>
                                  <CustomSelect
                                    value={formState.tipoAlcance}
                                    placeholder="Seleccionar alcance"
                                    required
                                    onChange={(v) => update('tipoAlcance', v)}
                                    options={[
                                      { value: 'Nuevo desde cero', label: 'Nuevo desde cero' },
                                      { value: 'Rediseño de algo existente', label: 'Rediseño / mejora' },
                                      { value: 'Migración a nueva plataforma', label: 'Migración de plataforma' },
                                      { value: 'Todavía no estoy seguro', label: 'Todavía no estoy seguro' },
                                    ]}
                                  />
                                </Field>
                              </div>
                              <Field
                                label="¿En qué rubro operás?"
                                filled={!!formState.rubro.trim()}
                                hint="Nos ayuda a entender tu mercado y tus referencias."
                              >
                                <input
                                  className={inputClass}
                                  placeholder="Ej: salud, legal, ecommerce, turismo…"
                                  value={formState.rubro}
                                  onChange={(e) => update('rubro', e.target.value)}
                                />
                              </Field>
                            </>
                          ) : null}

                          {step === 2 ? (
                            <>
                              <Field label="¿Cuál es el objetivo de negocio más importante?" filled={!!formState.objetivoPrincipal.trim()}>
                                <CustomSelect
                                  value={formState.objetivoPrincipal}
                                  placeholder="Seleccionar objetivo"
                                  required
                                  onChange={(v) => update('objetivoPrincipal', v)}
                                  options={[
                                    { value: 'Generar más leads calificados', label: 'Generar más leads calificados' },
                                    { value: 'Vender online con mayor conversión', label: 'Vender online con mayor conversión' },
                                    { value: 'Reducir tareas manuales y errores operativos', label: 'Reducir tareas manuales y errores' },
                                    { value: 'Mejorar la experiencia de clientes actuales', label: 'Mejorar la experiencia de clientes' },
                                    { value: 'Validar una nueva idea de producto', label: 'Validar una nueva idea de producto' },
                                  ]}
                                />
                              </Field>
                              <Field
                                label="¿Qué funcionalidad es imprescindible para la primera versión?"
                                filled={formState.funcionalidadClave.trim().length > 2}
                                hint="Pensá en el mínimo que tiene que funcionar el día del lanzamiento."
                              >
                                <textarea
                                  rows={3}
                                  className={textareaClass}
                                  placeholder="Ej: checkout con tarjeta, agenda online con recordatorios, panel para gestionar pedidos…"
                                  value={formState.funcionalidadClave}
                                  onChange={(e) => update('funcionalidadClave', e.target.value)}
                                />
                              </Field>
                              <Field
                                label="¿Quién es tu cliente ideal y en qué mercado te movés?"
                                filled={!!formState.publicoObjetivo.trim()}
                                optional
                                hint="Cuanto más específico, mejor entendemos a quién hablarle."
                              >
                                <textarea
                                  rows={3}
                                  className={textareaClass}
                                  placeholder="Ej: pymes de Montevideo, clínicas de Uruguay, consumidores B2C en Latam…"
                                  value={formState.publicoObjetivo}
                                  onChange={(e) => update('publicoObjetivo', e.target.value)}
                                />
                              </Field>
                            </>
                          ) : null}

                          {step === 3 ? (
                            <>
                              <div className="grid md:grid-cols-2 gap-6">
                                <Field label="Rango de inversión" filled={!!formState.rangoPresupuesto.trim()}>
                                  <CustomSelect
                                    value={formState.rangoPresupuesto}
                                    placeholder="Seleccionar rango"
                                    required
                                    onChange={(v) => update('rangoPresupuesto', v)}
                                    options={[
                                      { value: 'Menos de USD 1.000', label: 'Menos de USD 1.000' },
                                      { value: 'USD 1.000 - USD 3.000', label: 'USD 1.000 - USD 3.000' },
                                      { value: 'USD 3.000 - USD 7.000', label: 'USD 3.000 - USD 7.000' },
                                      { value: 'Más de USD 7.000', label: 'Más de USD 7.000' },
                                      { value: 'No lo tengo definido', label: 'No lo tengo definido' },
                                    ]}
                                  />
                                </Field>
                                <Field label="Plazo objetivo de lanzamiento" filled={!!formState.plazoDeseado.trim()}>
                                  <CustomSelect
                                    value={formState.plazoDeseado}
                                    placeholder="Seleccionar plazo"
                                    required
                                    onChange={(v) => update('plazoDeseado', v)}
                                    options={[
                                      { value: 'Urgente (1-2 semanas)', label: 'Urgente (1-2 semanas)' },
                                      { value: 'Normal (3-6 semanas)', label: 'Normal (3-6 semanas)' },
                                      { value: 'Planificado (2-3 meses)', label: 'Planificado (2-3 meses)' },
                                      { value: 'Más de 3 meses', label: 'Más de 3 meses' },
                                    ]}
                                  />
                                </Field>
                              </div>

                              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3">
                                  Resumen
                                </div>
                                <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-[13.5px]">
                                  <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                                    <dt className="text-white/45">Proyecto</dt>
                                    <dd className="text-white/85 text-right">{formState.tipoProyecto || '—'}</dd>
                                  </div>
                                  <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                                    <dt className="text-white/45">Alcance</dt>
                                    <dd className="text-white/85 text-right">{formState.tipoAlcance || '—'}</dd>
                                  </div>
                                  <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                                    <dt className="text-white/45">Rubro</dt>
                                    <dd className="text-white/85 text-right truncate">{formState.rubro || '—'}</dd>
                                  </div>
                                  <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                                    <dt className="text-white/45">Contacto</dt>
                                    <dd className="text-white/85 text-right truncate">{formState.nombre || '—'}</dd>
                                  </div>
                                </dl>
                              </div>
                            </>
                          ) : null}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {error ? (
                      <p className="mt-6 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                        {error}
                      </p>
                    ) : null}

                    {/* Navegación */}
                    <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/8 pt-6">
                      {step > 0 ? (
                        <button
                          type="button"
                          onClick={goBack}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/12 px-5 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:bg-white/[0.04]"
                        >
                          <ArrowLeft />
                          Atrás
                        </button>
                      ) : (
                        <span className="text-[12.5px] text-white/40 max-w-[16rem] hidden sm:block">
                          Respuesta en menos de 24h hábiles. Tus datos no se comparten.
                        </span>
                      )}

                      {step < TOTAL_STEPS - 1 ? (
                        <button
                          type="submit"
                          disabled={!isStepValid(step)}
                          className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 text-sm font-semibold text-[#fff] shadow-[0_15px_40px_-15px_rgba(16,185,129,0.9)] transition-all hover:-translate-y-0.5 hover:from-emerald-400 hover:to-emerald-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                        >
                          Continuar
                          <span className="transition-transform group-hover:translate-x-1">
                            <ArrowRight />
                          </span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={!allValid || sending}
                          className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 text-sm font-semibold text-[#fff] shadow-[0_15px_40px_-15px_rgba(16,185,129,0.9)] transition-all hover:-translate-y-0.5 hover:from-emerald-400 hover:to-emerald-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                        >
                          {sending ? (
                            <>
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                              </svg>
                              Enviando…
                            </>
                          ) : (
                            <>
                              Enviar cuestionario
                              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

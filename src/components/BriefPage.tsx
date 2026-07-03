import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import { submitPublicBudgetRequest } from '../lib/cms';

type BriefFormState = {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  rubro: string;
  tipoProyecto: string;
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
  objetivoPrincipal: '',
  publicoObjetivo: '',
  funcionalidadClave: '',
  rangoPresupuesto: '',
  plazoDeseado: '',
};

const inputClass =
  'peer h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-[15px] text-white outline-none transition-all placeholder:text-white/30 hover:border-white/20 focus:border-emerald-400/70 focus:bg-white/[0.05] focus:ring-4 focus:ring-emerald-400/15';
const textareaClass =
  'peer min-h-[120px] w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-white outline-none transition-all placeholder:text-white/30 hover:border-white/20 focus:border-emerald-400/70 focus:bg-white/[0.05] focus:ring-4 focus:ring-emerald-400/15';

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

type FieldProps = {
  index: number;
  label: string;
  children: ReactNode;
  filled: boolean;
  hint?: string;
  className?: string;
};

function Field({ index, label, children, filled, hint, className }: FieldProps) {
  return (
    <div className={`group relative ${className ?? ''}`}>
      <div className="mb-2 flex items-center gap-2.5">
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-semibold tabular-nums transition-all ${
            filled
              ? 'bg-emerald-400 text-emerald-950 ring-2 ring-emerald-400/30'
              : 'bg-white/[0.06] text-white/55 ring-1 ring-white/10'
          }`}
        >
          {filled ? <CheckIcon /> : index}
        </span>
        <label className="text-[13.5px] font-medium text-white/85">{label}</label>
      </div>
      {children}
      {hint ? <p className="mt-1.5 pl-9 text-[12px] text-white/40">{hint}</p> : null}
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
          open
            ? 'border-emerald-400/70 bg-white/[0.05]'
            : 'border-white/10'
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
          className={`absolute z-40 max-h-64 w-full overflow-auto rounded-xl border border-white/12 bg-[linear-gradient(180deg,rgba(20,22,40,0.98),rgba(11,14,30,0.98))] p-1.5 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl ${
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
                    isHighlighted
                      ? 'bg-emerald-400/12 text-white'
                      : 'text-white/80 hover:bg-white/[0.04]'
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

export default function BriefPage() {
  const [formState, setFormState] = useState<BriefFormState>(defaultState);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const completion = useMemo(() => {
    const fields: Array<keyof BriefFormState> = [
      'nombre',
      'email',
      'telefono',
      'empresa',
      'rubro',
      'tipoProyecto',
      'objetivoPrincipal',
      'publicoObjetivo',
      'funcionalidadClave',
      'rangoPresupuesto',
    ];
    const filled = fields.filter((key) => formState[key].trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [formState]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setError(null);
    setFeedback(null);

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
          `Público objetivo: ${formState.publicoObjetivo.trim()}`,
          `Funcionalidad clave: ${formState.funcionalidadClave.trim()}`,
        ]
          .filter((item) => !item.endsWith(': '))
          .join(' | '),
        rangoPresupuesto: formState.rangoPresupuesto.trim() || undefined,
        plazoDeseado: formState.plazoDeseado.trim() || undefined,
        funcionalidades: formState.funcionalidadClave
          ? [formState.funcionalidadClave.trim()]
          : [],
        referencia: formState.publicoObjetivo.trim() || '',
        aceptaContacto: true,
      });

      setFeedback('Cuestionario recibido. Te contactamos en menos de 24h hábiles con próximos pasos.');
      setFormState(defaultState);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No pudimos enviar el cuestionario');
    } finally {
      setSending(false);
    }
  };

  const update = <K extends keyof BriefFormState>(key: K, value: BriefFormState[K]) =>
    setFormState((cur) => ({ ...cur, [key]: value }));

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

            <div className="label mb-4">{"// cuestionario de proyecto"}</div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight max-w-4xl">
              Cotización clara, basada en
              {' '}
              <span className="text-grad italic font-light inline-block pr-2">10 respuestas precisas</span>
            </h1>
            <p className="mt-6 text-white/62 max-w-3xl text-base md:text-lg">
              Este cuestionario nos permite entender exactamente qué necesitás, para quién, con qué prioridad y con qué alcance.
              Con eso te devolvemos una propuesta concreta, sin suposiciones.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <div className="container-x">
            <div className="max-w-5xl mx-auto">
              {/* Progress bar */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <span className="text-[12px] font-mono tabular-nums text-white/55">
                  {completion}% completado
                </span>
              </div>

              <div className="relative rounded-3xl border border-white/12 bg-[linear-gradient(180deg,rgba(11,14,32,0.85),rgba(6,8,22,0.85))] backdrop-blur-xl shadow-[0_30px_100px_-40px_rgba(99,102,241,0.65)]">
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-purple/70 to-transparent" />
                  <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-violet/15 blur-[100px]" />
                  <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />
                </div>

                <form className="relative grid gap-10 p-6 md:p-10" onSubmit={onSubmit}>
                  {/* Section: Identidad */}
                  <section className="grid gap-6">
                    <header className="flex items-center gap-3 pb-4 border-b border-white/8">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/12 text-emerald-300 ring-1 ring-emerald-400/25 font-mono text-[12px]">01</span>
                      <div>
                        <h2 className="text-base font-semibold text-white">Identidad</h2>
                        <p className="text-[12.5px] text-white/45">Para que sepamos cómo y a quién responderle.</p>
                      </div>
                    </header>

                    <Field index={1} label="¿Cuál es tu nombre completo?" filled={!!formState.nombre.trim()}>
                      <input
                        className={inputClass}
                        autoComplete="name"
                        placeholder="Ej: Juan Pérez"
                        value={formState.nombre}
                        onChange={(event) => update('nombre', event.target.value)}
                        required
                      />
                    </Field>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Field index={2} label="Email principal para enviarte la propuesta" filled={!!formState.email.trim()}>
                        <input
                          type="email"
                          className={inputClass}
                          autoComplete="email"
                          placeholder="nombre@empresa.com"
                          value={formState.email}
                          onChange={(event) => update('email', event.target.value)}
                          required
                        />
                      </Field>
                      <Field index={3} label="¿A qué WhatsApp podemos contactarte?" filled={!!formState.telefono.trim()}>
                        <input
                          className={inputClass}
                          autoComplete="tel"
                          placeholder="+598 9X XXX XXX"
                          value={formState.telefono}
                          onChange={(event) => update('telefono', event.target.value)}
                        />
                      </Field>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Field index={4} label="¿Cómo se llama tu empresa o marca?" filled={!!formState.empresa.trim()}>
                        <input
                          className={inputClass}
                          autoComplete="organization"
                          placeholder="Ej: Acme S.A."
                          value={formState.empresa}
                          onChange={(event) => update('empresa', event.target.value)}
                        />
                      </Field>
                      <Field index={5} label="¿En qué rubro operás?" filled={!!formState.rubro.trim()}>
                        <input
                          className={inputClass}
                          placeholder="Ej: salud, legal, ecommerce, turismo…"
                          value={formState.rubro}
                          onChange={(event) => update('rubro', event.target.value)}
                          required
                        />
                      </Field>
                    </div>
                  </section>

                  {/* Section: Proyecto */}
                  <section className="grid gap-6">
                    <header className="flex items-center gap-3 pb-4 border-b border-white/8">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-violet/15 text-brand-violet ring-1 ring-brand-violet/30 font-mono text-[12px]">02</span>
                      <div>
                        <h2 className="text-base font-semibold text-white">Proyecto y objetivos</h2>
                        <p className="text-[12.5px] text-white/45">Lo que vamos a construir y por qué importa.</p>
                      </div>
                    </header>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Field index={6} label="¿Qué tipo de proyecto necesitás resolver hoy?" filled={!!formState.tipoProyecto.trim()}>
                        <CustomSelect
                          value={formState.tipoProyecto}
                          placeholder="Seleccionar tipo de proyecto"
                          onChange={(value) => update('tipoProyecto', value)}
                          options={[
                            { value: 'Landing', label: 'Landing' },
                            { value: 'E-commerce', label: 'E-commerce' },
                            { value: 'Sistema de reservas', label: 'Sistema de reservas' },
                            { value: 'Sistema interno', label: 'Sistema interno' },
                            { value: 'Automatización', label: 'Automatización' },
                            { value: 'Otro', label: 'Otro' },
                          ]}
                        />
                      </Field>

                      <Field index={7} label="¿Cuál es el objetivo de negocio más importante?" filled={!!formState.objetivoPrincipal.trim()}>
                        <CustomSelect
                          value={formState.objetivoPrincipal}
                          placeholder="Seleccionar objetivo"
                          required
                          onChange={(value) => update('objetivoPrincipal', value)}
                          options={[
                            { value: 'Generar más leads calificados', label: 'Generar más leads calificados' },
                            { value: 'Vender online con mayor conversión', label: 'Vender online con mayor conversión' },
                            { value: 'Reducir tareas manuales y errores operativos', label: 'Reducir tareas manuales y errores operativos' },
                            { value: 'Mejorar la experiencia de clientes actuales', label: 'Mejorar la experiencia de clientes actuales' },
                            { value: 'Validar una nueva idea de producto', label: 'Validar una nueva idea de producto' },
                          ]}
                        />
                      </Field>
                    </div>

                    <Field
                      index={8}
                      label="¿Quién es tu cliente ideal y en qué mercado te movés?"
                      filled={!!formState.publicoObjetivo.trim()}
                      hint="Cuanto más específico, mejor entendemos a quién hablarle."
                    >
                      <textarea
                        rows={3}
                        className={textareaClass}
                        placeholder="Ej: pymes de Montevideo, clínicas de Uruguay, consumidores B2C en Latam…"
                        value={formState.publicoObjetivo}
                        onChange={(event) => update('publicoObjetivo', event.target.value)}
                        required
                      />
                    </Field>

                    <Field
                      index={9}
                      label="¿Qué funcionalidad es imprescindible para la primera versión?"
                      filled={!!formState.funcionalidadClave.trim()}
                      hint="Pensá en el mínimo que tiene que funcionar el día del lanzamiento."
                    >
                      <textarea
                        rows={3}
                        className={textareaClass}
                        placeholder="Ej: checkout con tarjeta, agenda online con recordatorios, panel para gestionar pedidos…"
                        value={formState.funcionalidadClave}
                        onChange={(event) => update('funcionalidadClave', event.target.value)}
                        required
                      />
                    </Field>
                  </section>

                  {/* Section: Inversión */}
                  <section className="grid gap-6">
                    <header className="flex items-center gap-3 pb-4 border-b border-white/8">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/12 text-amber-300 ring-1 ring-amber-400/25 font-mono text-[12px]">03</span>
                      <div>
                        <h2 className="text-base font-semibold text-white">Inversión y plazo</h2>
                        <p className="text-[12.5px] text-white/45">Para alinear alcance con realidad desde el principio.</p>
                      </div>
                    </header>

                    <Field index={10} label="¿Cuál es tu rango de inversión y plazo objetivo de lanzamiento?" filled={!!formState.rangoPresupuesto.trim() && !!formState.plazoDeseado.trim()}>
                      <div className="grid md:grid-cols-2 gap-4">
                        <CustomSelect
                          value={formState.rangoPresupuesto}
                          placeholder="Rango de inversión"
                          required
                          onChange={(value) => update('rangoPresupuesto', value)}
                          options={[
                            { value: 'Menos de USD 1.000', label: 'Menos de USD 1.000' },
                            { value: 'USD 1.000 - USD 3.000', label: 'USD 1.000 - USD 3.000' },
                            { value: 'USD 3.000 - USD 7.000', label: 'USD 3.000 - USD 7.000' },
                            { value: 'Más de USD 7.000', label: 'Más de USD 7.000' },
                          ]}
                        />
                        <CustomSelect
                          value={formState.plazoDeseado}
                          placeholder="Plazo objetivo"
                          required
                          onChange={(value) => update('plazoDeseado', value)}
                          options={[
                            { value: 'Urgente (1-2 semanas)', label: 'Urgente (1-2 semanas)' },
                            { value: 'Normal (3-6 semanas)', label: 'Normal (3-6 semanas)' },
                            { value: 'Planificado (2-3 meses)', label: 'Planificado (2-3 meses)' },
                            { value: 'Más de 3 meses', label: 'Más de 3 meses' },
                          ]}
                        />
                      </div>
                    </Field>
                  </section>

                  {feedback ? (
                    <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                      {feedback}
                    </p>
                  ) : null}
                  {error ? (
                    <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {error}
                    </p>
                  ) : null}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/8">
                    <p className="text-[12.5px] text-white/45">
                      Al enviar este cuestionario recibís respuesta en menos de 24h hábiles. Tus datos no se comparten.
                    </p>
                    <button
                      type="submit"
                      className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 text-sm font-semibold text-white shadow-[0_15px_40px_-15px_rgba(16,185,129,0.9)] transition-all hover:-translate-y-0.5 hover:from-emerald-400 hover:to-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={sending}
                    >
                      {sending ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                            <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                          Enviando cuestionario…
                        </>
                      ) : (
                        <>
                          Enviar cuestionario estratégico
                          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

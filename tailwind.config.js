/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // `xs` para el rango de teléfonos anchos (el Hero ya lo referenciaba).
      screens: {
        xs: '475px',
      },
      // La paleta neutral (ink/bone/white) y los acentos (brand) se definen como
      // variables CSS en index.css y se invierten por tema ([data-theme]). Como
      // el código usa `ink` = familia de fondo, `bone`/`white` = familia de
      // primer plano de forma consistente, cambiar las variables invierte todo
      // el sitio sin tocar clases en los componentes. `<alpha-value>` mantiene
      // funcionando las opacidades tipo `text-white/65` / `bg-white/[0.03]`.
      colors: {
        ink: {
          950: 'rgb(var(--ink-950) / <alpha-value>)',
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          600: 'rgb(var(--ink-600) / <alpha-value>)',
        },
        bone: {
          50: 'rgb(var(--bone-50) / <alpha-value>)',
          100: 'rgb(var(--bone-100) / <alpha-value>)',
          200: 'rgb(var(--bone-200) / <alpha-value>)',
          300: 'rgb(var(--bone-300) / <alpha-value>)',
          400: 'rgb(var(--bone-400) / <alpha-value>)',
        },
        brand: {
          violet: 'rgb(var(--brand-violet) / <alpha-value>)',
          purple: 'rgb(var(--brand-purple) / <alpha-value>)',
          lavender: 'rgb(var(--brand-lavender) / <alpha-value>)',
          mist: 'rgb(var(--brand-mist) / <alpha-value>)',
          indigo: 'rgb(var(--brand-indigo) / <alpha-value>)',
          ink: 'rgb(var(--brand-ink) / <alpha-value>)',
        },
        white: 'rgb(var(--white) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'grad-brand': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 55%, #B9A7FF 100%)',
        'grad-soft': 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.12) 100%)',
        'grad-bone': 'linear-gradient(135deg, #F7F4EC 0%, #B9A7FF 100%)',
        'grad-deep': 'linear-gradient(180deg, #05060B 0%, #0A0C14 60%, #05060B 100%)',
      },
      // Los valores viven como variables CSS en index.css y cambian por tema:
      // glow violeta en oscuro, sombra neutra en claro.
      boxShadow: {
        glow: 'var(--shadow-glow)',
        'glow-sm': 'var(--shadow-glow-sm)',
        'glow-bone': 'var(--shadow-glow-bone)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'marquee': 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee 50s linear infinite reverse',
        'reveal': 'reveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 18s linear infinite',
        'orbit': 'orbit 20s linear infinite',
        'glitch': 'glitch 4s steps(2, end) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(40px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(40px) rotate(-360deg)' },
        },
        glitch: {
          '0%, 92%, 100%': { transform: 'translate(0)' },
          '93%': { transform: 'translate(-2px, 1px)' },
          '95%': { transform: 'translate(2px, -1px)' },
          '97%': { transform: 'translate(-1px, 2px)' },
        },
      },
    },
  },
  plugins: [],
};

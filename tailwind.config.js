/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050509',
          900: '#0A0A12',
          800: '#10101C',
          700: '#181828',
          600: '#22223A',
        },
        brand: {
          violet: '#7C3AED',
          purple: '#8B5CF6',
          indigo: '#6366F1',
          blue: '#3B82F6',
          cyan: '#22D3EE',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'grad-brand': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #C026D3 100%)',
        'grad-soft': 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.15) 100%)',
      },
      boxShadow: {
        glow: '0 0 60px -10px rgba(139, 92, 246, 0.45)',
        'glow-sm': '0 0 30px -5px rgba(139, 92, 246, 0.35)',
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

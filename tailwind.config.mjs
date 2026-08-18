/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '2rem', lg: '2.5rem' },
      screens: { '2xl': '1360px' },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Michroma', 'Impact', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: 'hsl(var(--bg) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        elevated: 'hsl(var(--elevated) / <alpha-value>)',
        line: 'hsl(var(--line) / <alpha-value>)',
        ink: 'hsl(var(--ink) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        gold: {
          DEFAULT: 'hsl(var(--gold) / <alpha-value>)',
          light: 'hsl(var(--gold-light) / <alpha-value>)',
          dark: 'hsl(var(--gold-dark) / <alpha-value>)',
        },
      },
      borderRadius: { xs: '0.25rem', sm: '0.375rem', DEFAULT: '0.5rem', md: '0.625rem', lg: '0.875rem', xl: '1.25rem', '2xl': '1.75rem' },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        'display-sm': ['clamp(1.75rem,4.5vw,2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display': ['clamp(2rem,5.5vw,3.5rem)', { lineHeight: '1.06', letterSpacing: '-0.015em' }],
        'display-lg': ['clamp(2.5rem,7vw,4.75rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        gold: '0 10px 40px -12px hsl(var(--gold) / 0.45)',
        'gold-lg': '0 24px 70px -20px hsl(var(--gold) / 0.55)',
        card: '0 2px 8px -2px rgb(0 0 0 / 0.3), 0 12px 40px -12px rgb(0 0 0 / 0.5)',
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translate3d(0,28px,0)' }, to: { opacity: '1', transform: 'none' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        marquee: { from: { transform: 'translate3d(0,0,0)' }, to: { transform: 'translate3d(-50%,0,0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        'pulse-ring': { '0%': { transform: 'scale(0.9)', opacity: '0.6' }, '70%,100%': { transform: 'scale(1.6)', opacity: '0' } },
        'scroll-hint': { '0%': { transform: 'translateY(0)', opacity: '0' }, '35%': { opacity: '1' }, '100%': { transform: 'translateY(14px)', opacity: '0' } },
      },
      animation: {
        'fade-up': 'fade-up .8s cubic-bezier(.16,1,.3,1) both',
        'fade-in': 'fade-in .8s ease both',
        marquee: 'marquee 42s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(.24,.8,.35,1) infinite',
        'scroll-hint': 'scroll-hint 2s ease-in-out infinite',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(.16,1,.3,1)',
      },
    },
  },
  plugins: [],
};

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // All colors reference CSS variables (RGB triples) for opacity support
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          2: 'rgb(var(--color-surface-2) / <alpha-value>)',
          3: 'rgb(var(--color-surface-3) / <alpha-value>)',
        },
        border: 'rgb(var(--color-border) / <alpha-value>)',
        text: {
          DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
          faint: 'rgb(var(--color-text-faint) / <alpha-value>)',
        },
        gold: {
          DEFAULT: 'rgb(var(--color-gold) / <alpha-value>)',
          hover: 'rgb(var(--color-gold-hover) / <alpha-value>)',
          muted: 'rgb(var(--color-gold-muted) / <alpha-value>)',
          dim: 'rgb(var(--color-gold-dim) / <alpha-value>)',
        },
        error: 'rgb(var(--color-error) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(2rem, 1.2rem + 2.5vw, 3.5rem)', { lineHeight: '1.1' }],
        title: ['clamp(1.5rem, 1.2rem + 1.25vw, 2.25rem)', { lineHeight: '1.15' }],
        heading: ['clamp(1.125rem, 1rem + 0.75vw, 1.5rem)', { lineHeight: '1.3' }],
        body: ['clamp(1rem, 0.95rem + 0.25vw, 1.125rem)', { lineHeight: '1.6' }],
        small: ['clamp(0.875rem, 0.8rem + 0.35vw, 1rem)', { lineHeight: '1.5' }],
        tiny: ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', { lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      maxWidth: {
        content: '1100px',
        prose: '72ch',
        narrow: '640px',
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          /* Core Colors */
          background: 'var(--color-background)', /* gray-50 */
          foreground: 'var(--color-foreground)', /* slate-800 */
          border: 'var(--color-border)', /* slate-200 */
          input: 'var(--color-input)', /* white */
          ring: 'var(--color-ring)', /* blue-600 */
          
          /* Card Colors */
          card: {
            DEFAULT: 'var(--color-card)', /* white */
            foreground: 'var(--color-card-foreground)' /* slate-800 */
          },
          
          /* Popover Colors */
          popover: {
            DEFAULT: 'var(--color-popover)', /* white */
            foreground: 'var(--color-popover-foreground)' /* slate-800 */
          },
          
          /* Muted Colors */
          muted: {
            DEFAULT: 'var(--color-muted)', /* slate-100 */
            foreground: 'var(--color-muted-foreground)' /* slate-500 */
          },
          
          /* Primary Colors */
          primary: {
            DEFAULT: 'var(--color-primary)', /* blue-600 */
            foreground: 'var(--color-primary-foreground)' /* white */
          },
          
          /* Secondary Colors */
          secondary: {
            DEFAULT: 'var(--color-secondary)', /* slate-500 */
            foreground: 'var(--color-secondary-foreground)' /* white */
          },
          
          /* Destructive Colors */
          destructive: {
            DEFAULT: 'var(--color-destructive)', /* red-600 */
            foreground: 'var(--color-destructive-foreground)' /* white */
          },
          
          /* Accent Colors */
          accent: {
            DEFAULT: 'var(--color-accent)', /* emerald-600 */
            foreground: 'var(--color-accent-foreground)' /* white */
          },
          
          /* Success Colors */
          success: {
            DEFAULT: 'var(--color-success)', /* emerald-500 */
            foreground: 'var(--color-success-foreground)' /* white */
          },
          
          /* Warning Colors */
          warning: {
            DEFAULT: 'var(--color-warning)', /* amber-500 */
            foreground: 'var(--color-warning-foreground)' /* slate-800 */
          },
          
          /* Error Colors */
          error: {
            DEFAULT: 'var(--color-error)', /* red-600 */
            foreground: 'var(--color-error-foreground)' /* white */
          },
          
          /* Surface Color */
          surface: 'var(--color-surface)', /* white */
          
          /* Text Colors */
          'text-primary': 'var(--color-text-primary)', /* slate-800 */
          'text-secondary': 'var(--color-text-secondary)' /* slate-500 */
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        },
        fontSize: {
          'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
          'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
          'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
          'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
          'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
          'fluid-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',
          'fluid-3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)',
        },
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
          '128': '32rem',
        },
        boxShadow: {
          'clinical': '0 1px 3px rgba(0, 0, 0, 0.1)',
          'clinical-md': '0 4px 6px rgba(0, 0, 0, 0.1)',
          'clinical-lg': '0 10px 25px rgba(0, 0, 0, 0.15)',
          'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
        borderRadius: {
          'clinical': '8px',
          'clinical-sm': '4px',
          'clinical-lg': '12px',
        },
        backdropBlur: {
          'clinical': '10px',
        },
        animation: {
          'pulse-success': 'pulse-success 2s infinite',
          'pulse-warning': 'pulse-warning 2s infinite',
          'pulse-error': 'pulse-error 2s infinite',
          'fade-in': 'fadeIn 200ms ease-out',
          'slide-down': 'slideDown 200ms ease-out',
          'slide-up': 'slideUp 200ms ease-out',
        },
        keyframes: {
          'pulse-success': {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.7' }
          },
          'pulse-warning': {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.8' }
          },
          'pulse-error': {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.9' }
          },
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' }
          },
          slideDown: {
            '0%': { transform: 'translateY(-10px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' }
          },
          slideUp: {
            '0%': { transform: 'translateY(10px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' }
          }
        },
        transitionTimingFunction: {
          'clinical': 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        zIndex: {
          'navigation': '1000',
          'alerts': '1100',
          'emergency': '1200',
          'modal': '1300',
        }
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
      require('@tailwindcss/forms'),
      require('tailwindcss-animate'),
    ],
  }
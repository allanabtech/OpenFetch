import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Background scale — used as bg-base, bg-surface, bg-elevated
        base:    '#0a0a0f',
        surface: '#12121a',
        elevated:'#1a1a26',
        // Accent colours
        violet:  '#7c3aed',
        cyan:    '#06b6d4',
        // Text
        'text-primary': '#f0f0ff',
        'text-muted':   '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease-out forwards',
        'slide-up':  'slideUp 0.4s ease-out forwards',
        'slide-in':  'slideIn 0.3s ease-out forwards',
        'glow':      'glowPulse 2s ease-in-out infinite',
        'float':     'float 3s ease-in-out infinite',
        'shimmer':   'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(-12px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',      opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(124, 58, 237, 0.4)' },
          '50%':       { boxShadow: '0 0 24px rgba(124, 58, 237, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
      },
      boxShadow: {
        'glow-violet': '0 0 15px -3px rgba(124, 58, 237, 0.5)',
        'glow-cyan':   '0 0 15px -3px rgba(6, 182, 212, 0.5)',
        'glow-lg':     '0 0 30px -5px rgba(124, 58, 237, 0.4)',
      },
      borderRadius: {
        glass: '16px',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config

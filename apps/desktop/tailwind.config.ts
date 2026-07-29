import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0a0a0f',
        surface: '#12121a',
        elevated: '#1a1a26',
        'accent-violet': '#7c3aed',
        'accent-cyan': '#06b6d4',
        'text-primary': '#f0f0ff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideIn: 'slideIn 0.3s ease-out',
        glow: 'glow 2s infinite alternate',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(124, 58, 237, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.6)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))' },
          '50%': { opacity: '.5', filter: 'drop-shadow(0 0 2px rgba(6, 182, 212, 0.3))' },
        },
      },
      boxShadow: {
        'glow-violet': '0 0 15px -3px rgba(124, 58, 237, 0.5)',
        'glow-cyan': '0 0 15px -3px rgba(6, 182, 212, 0.5)',
      },
      borderRadius: {
        glass: '16px',
      },
    },
  },
  plugins: [],
}
export default config

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['IBM Plex Mono', 'Consolas', 'monospace'],
        mono:    ['IBM Plex Mono', 'Consolas', 'monospace'],
        display: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        phosphor: {
          50:  '#f0fff4',
          100: '#c6ffd8',
          200: '#8bff9a',
          300: '#39ff6e',
          400: '#00e84d',
          500: '#00c23e',
          600: '#009930',
          700: '#007024',
          800: '#004d18',
          900: '#002b0d',
          950: '#001408',
        },
        terminal: {
          0:   '#000000',
          50:  '#050a05',
          100: '#091209',
          150: '#0d1a0d',
          200: '#112411',
          300: '#1a381a',
          400: '#244d24',
          500: '#2e612e',
          600: '#3d7a3d',
          700: '#4f9a4f',
          800: '#72b872',
          900: '#a8d8a8',
          950: '#d4ecd4',
        },
        amber: { 400: '#ffb300', 500: '#e09900' },
        red:   { 400: '#ff4444', 500: '#cc2222' },
        cyan:  { 400: '#00e5ff', 500: '#00b8cc' },
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem', letterSpacing: '0.04em' }],
      },
      boxShadow: {
        'glow-sm':  '0 0 8px -1px rgba(0,232,77,0.3)',
        'glow':     '0 0 16px -2px rgba(0,232,77,0.4)',
        'glow-lg':  '0 0 32px -4px rgba(0,232,77,0.5)',
        'glow-xl':  '0 0 48px -6px rgba(0,232,77,0.6)',
        'amber-glow': '0 0 12px -2px rgba(255,179,0,0.4)',
        'red-glow':   '0 0 12px -2px rgba(255,68,68,0.4)',
      },
      borderRadius: {
        DEFAULT: '2px', 'sm': '2px', 'md': '3px', 'lg': '4px',
        'xl': '4px', '2xl': '6px', '3xl': '8px', 'full': '9999px',
      },
      animation: {
        'fade-in':    'fadeIn 0.15s ease-out',
        'fade-up':    'fadeUp 0.2s ease-out',
        'slide-in':   'slideIn 0.2s ease-out',
        'blink':      'blink 1s step-end infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeUp:  { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-6px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        blink:   { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
      },
    },
  },
  plugins: [],
}

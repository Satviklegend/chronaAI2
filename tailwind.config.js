/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        neon: {
          cyan:   '#00fff7',
          pink:   '#ff2d78',
          green:  '#39ff14',
          yellow: '#ffee00',
          purple: '#bf00ff',
          blue:   '#0066ff',
          orange: '#ff6600',
        },
        dark: {
          950: '#030308',
          900: '#070710',
          800: '#0d0d1a',
          700: '#13132a',
          600: '#1a1a3a',
        }
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 9s ease-in-out infinite',
        'glow-pulse':   'glowPulse 2s ease-in-out infinite',
        'scan':         'scan 3s linear infinite',
        'fade-up':      'fadeUp 0.5s ease-out forwards',
        'fade-in':      'fadeIn 0.4s ease-out forwards',
        'slide-down':   'slideDown 0.3s ease-out forwards',
        'scale-in':     'scaleIn 0.25s ease-out forwards',
        'spin-slow':    'spin 8s linear infinite',
        'border-glow':  'borderGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float:       { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-18px)' } },
        glowPulse:   { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
        scan:        { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100vh)' } },
        fadeUp:      { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:      { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideDown:   { '0%': { opacity: '0', transform: 'translateY(-10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:     { '0%': { opacity: '0', transform: 'scale(0.92)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        borderGlow:  { '0%,100%': { boxShadow: '0 0 8px currentColor' }, '50%': { boxShadow: '0 0 24px currentColor, 0 0 48px currentColor' } },
      },
      boxShadow: {
        'neon-cyan':   '0 0 20px #00fff7, 0 0 60px #00fff744',
        'neon-pink':   '0 0 20px #ff2d78, 0 0 60px #ff2d7844',
        'neon-green':  '0 0 20px #39ff14, 0 0 60px #39ff1444',
        'neon-purple': '0 0 20px #bf00ff, 0 0 60px #bf00ff44',
        'neon-blue':   '0 0 20px #0066ff, 0 0 60px #0066ff44',
        'card':        '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        base: {
          950: '#070a13',
          900: '#0b0f1a',
          800: '#121826',
          700: '#1a2233',
          600: '#232d42',
        },
        pulse: {
          // Driven by --accent / --accent-dark CSS vars (see index.css),
          // which are switched per accentColor preset in useTheme.ts.
          // This means every existing `pulse-teal` usage across the app
          // automatically reskins when the user picks a different accent.
          teal: 'rgb(var(--accent) / <alpha-value>)',
          tealDark: 'rgb(var(--accent-dark) / <alpha-value>)',
          violet: '#8b5cf6',
          coral: '#ff6b5b',
          amber: '#fbbf24',
          green: '#34d399',
          red: '#f87171',
          blue: '#38bdf8',
        },
      },
      backgroundImage: {
        'pulse-gradient': 'linear-gradient(135deg, rgb(var(--accent)) 0%, rgb(var(--accent-secondary)) 100%)',
        'coral-gradient': 'linear-gradient(135deg, #ff6b5b 0%, #fbbf24 100%)',
        'radial-glow': 'radial-gradient(circle at top, rgb(var(--accent) / 0.15), transparent 60%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 24px rgb(var(--accent) / 0.35)',
        'glow-violet': '0 0 24px rgba(139, 92, 246, 0.35)',
        'glow-coral': '0 0 24px rgba(255, 107, 91, 0.35)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-up': 'fade-up 0.5s ease-out forwards',
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.55 },
        },
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

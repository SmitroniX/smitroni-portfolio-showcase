/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        smit: {
          orange: '#FF6B00',
          'orange-glow': '#FF8A00',
          dark: '#07090E',
          card: 'rgba(15, 23, 42, 0.65)',
          border: 'rgba(255, 107, 0, 0.25)',
          cyan: '#00F0FF',
          neonGreen: '#00FF9D',
          purple: '#A855F7'
        }
      },
      fontFamily: {
        mono: ['"Fira Code"', 'JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'matrix-fade': 'matrixFade 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%': { filter: 'drop-shadow(0 0 10px rgba(255, 107, 0, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 25px rgba(255, 107, 0, 0.85))' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}

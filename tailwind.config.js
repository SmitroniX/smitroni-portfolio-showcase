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
        'spin-fast': 'spin 1.5s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'matrix-fade': 'matrixFade 2s ease-in-out infinite alternate',
        'laser-scan': 'laserScan 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'border-spin': 'borderSpin 4s linear infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'equalizer-1': 'equalizer 0.8s ease-in-out infinite alternate',
        'equalizer-2': 'equalizer 1.1s ease-in-out 0.2s infinite alternate',
        'equalizer-3': 'equalizer 0.9s ease-in-out 0.4s infinite alternate',
        'equalizer-4': 'equalizer 1.3s ease-in-out 0.1s infinite alternate',
        'neon-ping': 'neonPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite',
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
        },
        laserScan: {
          '0%': { top: '0%', opacity: '0.8', boxShadow: '0 0 15px #00F0FF, 0 0 30px #00FF9D' },
          '50%': { opacity: '1', boxShadow: '0 0 25px #00FF9D, 0 0 45px #00F0FF' },
          '100%': { top: '100%', opacity: '0.8', boxShadow: '0 0 15px #00F0FF, 0 0 30px #00FF9D' },
        },
        borderSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        equalizer: {
          '0%': { height: '3px' },
          '100%': { height: '14px' },
        },
        neonPing: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
      }
    },
  },
  plugins: [],
}

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
        cyber: {
          void: '#050608',
          bg: '#080a0f',
          surface: '#0d1117',
          card: 'rgba(13, 17, 23, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-bright': 'rgba(0, 240, 255, 0.25)',
        },
        neon: {
          cyan: '#00f0ff',
          pink: '#ff0055',
          purple: '#8b5cf6',
          green: '#00ff66',
          gold: '#ffb800',
          red: '#ef4444',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 240, 255, 0.35)',
        'glow-pink': '0 0 20px -3px rgba(255, 0, 85, 0.35)',
        'glow-purple': '0 0 20px -3px rgba(139, 92, 246, 0.35)',
        'glow-green': '0 0 20px -3px rgba(0, 255, 102, 0.35)',
        'glow-gold': '0 0 20px -3px rgba(255, 184, 0, 0.35)',
        'card-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 240, 255, 0.5)' },
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

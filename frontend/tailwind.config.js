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
        bloom: {
          50: '#FDF4F6',
          100: '#FCE7EB',
          200: '#FAD0D9',
          300: '#F5A7B9',
          400: '#EE7392',
          500: '#E14670',
          600: '#C72F57',
          700: '#A42144',
          800: '#861E39',
          900: '#521424',
          950: '#2E0712',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E5EDE5',
          200: '#CCDCCC',
          300: '#A7C3A7',
          400: '#7FA67F',
          500: '#5F8A5F',
          600: '#4B6E4B',
          700: '#3C583C',
          800: '#314631',
        },
        rosewood: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
        },
        honey: {
          50: '#FFFDF0',
          100: '#FFF9C2',
          200: '#FFF085',
          300: '#FFE247',
          400: '#F5CB18',
          500: '#D9AC08',
        },
        warmgray: {
          50: '#FAF8F9',
          100: '#F4EFF1',
          200: '#E8DFE3',
          300: '#D6C8CE',
          400: '#B09DA5',
          500: '#8D7B83',
          600: '#705F67',
          700: '#55474E',
          800: '#3A2E34',
          900: '#20181C',
          950: '#130C10',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        handwritten: ['"Caveat"', '"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(225, 70, 112, 0.08)',
        'soft-lg': '0 14px 40px rgba(0, 0, 0, 0.08)',
        'cozy': '0 4px 20px -2px rgba(199, 47, 87, 0.15)',
        'glow-pink': '0 0 25px rgba(225, 70, 112, 0.45)',
        'glow-purple': '0 0 25px rgba(168, 85, 247, 0.45)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'float-reverse': 'floatReverse 8s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'wiggle': 'wiggle 1.2s ease-in-out infinite',
        'spin-slow': 'spin 16s linear infinite',
        'bounce-subtle': 'bounceSubtle 2.5s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(5deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(-5deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.88', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        glowPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(225, 70, 112, 0.4))' },
          '50%': { filter: 'drop-shadow(0 0 22px rgba(168, 85, 247, 0.6))' },
        }
      }
    },
  },
  plugins: [],
}

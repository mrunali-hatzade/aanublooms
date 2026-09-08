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
          50: '#FAF4F4',
          100: '#F5E7E7',
          200: '#ECD3D4',
          300: '#E4BDC0', // soft dusty blush rose
          400: '#CF999F',
          500: '#B26F79', // dusty mauve rose
          600: '#945C6C', // rich dusty mauve card tone
          700: '#794150', // deep berry
          800: '#5E2B38',
          900: '#451724', // deep plum burgundy (logo & headlines)
          950: '#2A0A13',
        },
        mauve: {
          card: '#946171',
          cardHover: '#875464',
          border: '#7D4B5B',
          light: '#ECC5C1',
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
          50: '#FAF4F5',
          100: '#F5E8EB',
          200: '#EBD2D7',
          300: '#DCB0B9',
          400: '#C78895',
          500: '#AC6574',
          600: '#914B5A',
          700: '#763845',
        },
        honey: {
          50: '#FDFBF4',
          100: '#F9F2DE',
          200: '#F2E1B5',
          300: '#E7CC87',
          400: '#DBB55D',
          500: '#C99742', // warm mustard caramel gold
          600: '#B28030',
          700: '#8E6221',
        },
        warmgray: {
          50: '#FAF5EE',  // warm creamy linen ivory canvas
          100: '#F4ECE1',
          200: '#E6D9CA',
          300: '#D2BFAD',
          400: '#AFA092',
          500: '#8A7A6E',
          600: '#6C5D53',
          700: '#50433A',
          800: '#382D26',
          900: '#231A15',
          950: '#150E0B',
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
        'float-gentle': 'floatGentle 5s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'shimmer-fast': 'shimmer 1.5s infinite linear',
        'wiggle': 'wiggle 1.2s ease-in-out infinite',
        'spin-slow': 'spin 18s linear infinite',
        'bounce-subtle': 'bounceSubtle 2.5s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'blob-drift': 'blobDrift 10s ease-in-out infinite',
        'sway': 'sway 4s ease-in-out infinite',
        'pop-in': 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(4deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(-4deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 15px rgba(225, 70, 112, 0.2)' },
          '50%': { transform: 'scale(1.03)', boxShadow: '0 0 25px rgba(225, 70, 112, 0.45)' },
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
          '0%, 100%': { filter: 'drop-shadow(0 0 8px rgba(225, 70, 112, 0.35))' },
          '50%': { filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.6))' },
        },
        blobDrift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(20px, -25px) scale(1.08)' },
          '66%': { transform: 'translate(-15px, 15px) scale(0.95)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}

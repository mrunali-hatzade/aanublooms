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
          50: '#FDF8F5',
          100: '#FAECE5',
          200: '#F6D9CD',
          300: '#EEB7A2',
          400: '#E38D6F',
          500: '#D96B43',
          600: '#C15029',
          700: '#9F3E1E',
          800: '#7F331B',
          900: '#421B0F',
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
          50: '#FFF5F7',
          100: '#FFE9EE',
          200: '#FFD7E2',
          300: '#FFB4C8',
          400: '#F981A4',
          500: '#E8507D',
          600: '#C7315E',
          700: '#A12247',
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
          50: '#FAF8F5',
          100: '#F2EDE7',
          200: '#E4DDD3',
          300: '#CFC5B8',
          400: '#B0A292',
          500: '#8F7F6E',
          600: '#736454',
          700: '#5A4D40',
          800: '#3B3229',
          900: '#231D17',
          950: '#17130F',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        handwritten: ['"Caveat"', '"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(217, 107, 67, 0.08)',
        'soft-lg': '0 14px 40px rgba(0, 0, 0, 0.08)',
        'cozy': '0 4px 20px -2px rgba(193, 80, 41, 0.12)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}

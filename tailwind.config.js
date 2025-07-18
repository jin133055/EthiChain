/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        blink: {
          '0%, 100%': { borderColor: 'white' },
          '50%': { borderColor: 'transparent' },
        }
      },
      animation: {
        blink: 'blink 1s step-end infinite'
      }
    },
  },
  plugins: [],
};

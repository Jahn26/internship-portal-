/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 40px rgba(56, 189, 248, 0.16)',
      },
      colors: {
        ink: {
          950: '#050816',
          900: '#0b1120',
          850: '#111827',
          800: '#1f2937',
        },
      },
    },
  },
  plugins: [],
};

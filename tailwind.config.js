/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4B5563',
          DEFAULT: '#111827',
          dark: '#0B0F19',
        },
        secondary: '#1F2937',
        accent: '#2563EB',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('tailwindcss-safe-area'),
  ],
}

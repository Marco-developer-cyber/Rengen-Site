/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0C0F3A',
        secondary: '#1A0033',
        accent: '#00FFF7',
        accent2: '#CE67D3',
      },
    },
  },
  plugins: [],
} 
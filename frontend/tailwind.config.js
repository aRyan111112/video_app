/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-color': '#0f0f13',
        'bg-secondary': '#1a1a20',
        'bg-tertiary': '#272732',
        'accent': '#6366f1',
        'accent-hover': '#4f46e5'
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        airtel: {
          red: '#E40000',
          darkred: '#B30000',
          crimson: '#880000',
          lightred: '#FF4D4D',
          dark: '#0B0F19',
          card: '#131B2E',
          cardHover: '#1B2642',
          border: '#223050',
          muted: '#8A99AD',
          text: '#F8FAFC'
        }
      }
    },
  },
  plugins: [],
}

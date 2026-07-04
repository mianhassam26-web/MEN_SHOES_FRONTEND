/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#1F5A24',
          light: '#2F7A35',
          dark: '#143D19',
        },
        red: {
          brand: '#207A20',
        },
        dark: '#111111',
        beige: '#D8B79C',
        lgray: '#ECECEC',
        gold: {
          DEFAULT: '#C6A15B',
          light: '#DFC48C',
          dark: '#9C7C3E',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        button: ['Montserrat', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        premium: '0 10px 40px -10px rgba(31, 90, 36, 0.25)',
      },
    },
  },
  plugins: [],
}

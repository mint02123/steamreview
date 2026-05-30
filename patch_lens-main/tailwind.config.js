/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        steam: {
          bg: '#1b2838',
          sub: '#2a475e',
          card: '#16202d',
          accent: '#66c0f4',
          text: '#c6d4df',
        },
      },
      fontFamily: {
        sans: ["'Noto Sans KR'", 'sans-serif'],
      },
    },
  },
  plugins: [],
}

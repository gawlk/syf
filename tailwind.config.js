/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{html,vue,js,ts,jsx,tsx,svelte,md}'],
  theme: {
    extend: {
      fontFamily: {
        druk: ['Druk X'],
        sans: [
          'Lexend var',
          ...require('tailwindcss/defaultTheme').fontFamily.sans,
        ],
      },
      screens: {
        '2xl': '1600px',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}

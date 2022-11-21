/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./index.html', './src/**/*.{html,vue,js,ts,jsx,tsx,svelte,mdx}'],
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
  },
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
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/line-clamp'),
  ],
}

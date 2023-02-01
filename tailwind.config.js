/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [`'Montserrat'`, ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gray: {
          DEFAULT: "#f7f7f7",
          secondary: "#75808a",
          ...defaultTheme.colors.gray,
        },
        primary: {
          50: "#F3F5FF",
          100: "#D9D9F9",
          200: "#CBCBFF",
          300: "#8C8DFC",
          400: "#5D65B9",
          500: "#53579f",
          600: "#4E529A",
          700: "#32325D",
          800: "#27274E",
          900: "#11142B",
        },
      },
    },
    screens: {
      xxs: "320px",
      xs: "480px",
      sm: "640px",
      md: "720px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1920px",
    },
  },
  plugins: [],
};

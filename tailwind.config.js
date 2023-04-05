/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./views/**/*.vue",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [`'Inter'`, ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gray: {
          DEFAULT: "#f7f7f7",
          secondary: "#75808a",
          input: "#edeff2",
          "input-focus": "#dfe3e7",
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
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        ".h1": {
          fontSize: "32px",
          fontWeight: theme("fontWeight.bold"),
          lineHeight: theme("lineHeight.tight"),
          paddingTop: theme("padding.5"),
          paddingBottom: theme("padding.4"),
        },
        ".h2": {
          fontSize: "26px",
          fontWeight: theme("fontWeight.bold"),
          lineHeight: theme("lineHeight.tight"),
          paddingTop: theme("padding.5"),
          paddingBottom: theme("padding.4"),
        },
      });
    }),
  ],
};

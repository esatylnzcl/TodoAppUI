import { colors } from "./src/config/colors";

import { darkColors, lightColors, ktpColors } from "./src/config/colors";

/** @type {import('tailwindcss').Config} */
export default {
 content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
 darkMode: "class",
 theme: {
  extend: {
   // colors: {
   //   // KTP Base Colors
   //   ktp_red: ktpColors.red,
   //   ktp_gray: ktpColors.gray,
   //   ktp_federal_blue: ktpColors.federal_blue,
   //   ktp_black: ktpColors.black,
   //   ktp_delft_blue: ktpColors.delft_blue,
   //   ktp_white: ktpColors.white,
   //   ktp_blue_green: ktpColors.blue_green,
   //   ktp_yellow: ktpColors.yellow,
   //   // Dynamic colors (темные по умолчанию)
   //   background: {
   //     primary: darkColors.background.primary,
   //     secondary: darkColors.background.secondary,
   //     tertiary: darkColors.background.tertiary,
   //   },
   //   border: {
   //     light: darkColors.border.light,
   //     medium: darkColors.border.medium,
   //     dark: darkColors.border.dark,
   //   },
   //   text: {
   //     primary: darkColors.text.primary,
   //     secondary: darkColors.text.secondary,
   //     tertiary: darkColors.text.tertiary,
   //     muted: darkColors.text.muted,
   //   },
   // },
  },
 },
 plugins: [],
 corePlugins: {
  preflight: true,
 },
};

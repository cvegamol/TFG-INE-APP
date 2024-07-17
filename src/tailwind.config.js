/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.{js,jsx,ts,tsx}",
    "./app/*.{js,jsx,ts,tsx}",
    "./components/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#B4CEB3",
        secondary: "#88A0A8",
        tertiary: "#546A76",
        quarter: "#DBD3C9",
        textPrimary: "#000000", // Negro para el texto principal
      },
    },
  },
  plugins: [],
};

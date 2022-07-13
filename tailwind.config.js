/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    colors: {
      transparent: "transparent",
      black: "#040013",
      white: "#F9F9F9",
      pink: "#FF0086",
      purple: "#550086",
      darkblue: "#080025",
      blue: "#140063",
      lightblue: "#5d61e8",
    },
    fontFamily: { sans: ["Roboto", "sans-serif"] },
  },
  plugins: [],
};

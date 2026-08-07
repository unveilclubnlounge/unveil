/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0d0b09",
        charcoal: "#18130f",
        cream: "#f3ead9",
        gold: "#c9a44c",
        "gold-light": "#e9c874",
        wine: "#7a1120",
        "wine-bright": "#b3282d",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
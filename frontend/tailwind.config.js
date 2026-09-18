/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F7F4EE",
        paper: "#FBF8F2",
        beige: "#E8DCC8",
        stone: "#E8DCC8",
        "stone-dark": "#CBB89A",
        brown: "#5A4637",
        ink: "#1E1E1E",
        "ink-soft": "#5A4637",
        muted: "#766A60",
        clay: "#5A4637",
        olive: "#827950",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
    },
  },
  plugins: [],
}

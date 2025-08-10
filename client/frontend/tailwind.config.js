/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",  // Pure black background
        darkBg: "#000000",  // Pure black mode
        darkCard: "#121212", // Slightly lighter black for cards
        darkText: "#ffffff", // Pure white text
      },
    },
  },
  plugins: [],
};

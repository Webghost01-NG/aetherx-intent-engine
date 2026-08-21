/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        claudeBg: "#0E0E10",
        claudeCard: "#18181B",
        claudeBorder: "#27272A",
        claudeText: "#F4F4F5",
        claudeMuted: "#A1A1AA",
        claudeAccent: "#D97706",
        okxGreen: "#00E599",
        cyanGlow: "#00F0FF",
      },
    },
  },
  plugins: [],
}

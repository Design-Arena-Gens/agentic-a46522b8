import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cinzel'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"]
      },
      colors: {
        charcoal: "#1e1f25",
        ember: "#f97316",
        aurora: "#38bdf8"
      }
    }
  },
  plugins: []
};

export default config;

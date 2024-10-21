import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nexa: ["var(--font-nexa)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        "heart-pulse": "pulse 0.25s ease-in-out",
        "particle-1": "particle 0.6s ease forwards",
        "particle-2": "particle 0.6s ease 0.1s forwards",
        "particle-3": "particle 0.6s ease 0.2s forwards",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
        },
        particle: {
          "0%": { opacity: "1", transform: "scale(1) translate(0, 0)" },
          "100%": {
            opacity: "0",
            transform: "scale(0) translate(40px, -40px)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;

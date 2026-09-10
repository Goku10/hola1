import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#06101f",
          900: "#0b1c33",
          800: "#122a4a",
          700: "#1a3a63",
        },
        sky: {
          accent: "#38bdf8",
          soft: "#e0f2fe",
        },
        teal: {
          DEFAULT: "#14b8a6",
          soft: "#ccfbf1",
          dark: "#0f766e",
        },
        amber: {
          warn: "#f59e0b",
        },
        rose: {
          danger: "#f43f5e",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(56, 189, 248, 0.25)",
        card: "0 10px 40px rgba(6, 16, 31, 0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { transform: "scale(0.96)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s ease-out both",
        pop: "pop 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;

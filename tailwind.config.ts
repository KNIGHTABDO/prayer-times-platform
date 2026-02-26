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
        arabic: ["Amiri", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        bg: {
          base: "#04090e",
          card: "#0a1520",
          hover: "#0f1f2e",
        },
        gold: {
          DEFAULT: "#d4af37",
          light: "#f0cc55",
          dark: "#a88c28",
        },
        emerald: {
          DEFAULT: "#10b981",
          dark: "#059669",
          glow: "rgba(16,185,129,0.15)",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        gold: "0 0 30px rgba(212,175,55,0.15), 0 0 60px rgba(212,175,55,0.05)",
        emerald: "0 0 30px rgba(16,185,129,0.2), 0 0 60px rgba(16,185,129,0.08)",
        card: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;

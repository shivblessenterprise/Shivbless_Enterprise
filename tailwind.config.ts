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
        brand: {
          50: "#FBF9F6",
          100: "#F5F0E8",
          200: "#E8DFD0",
          300: "#D4C4A8",
          400: "#C4A574",
          500: "#B08D5B",
          600: "#96754A",
          700: "#7A5E3C",
          800: "#644D34",
          900: "#53402C",
        },
        ink: {
          50: "#F7F7F6",
          100: "#EDEDEC",
          200: "#D8D8D6",
          300: "#B5B5B2",
          400: "#8A8A86",
          500: "#6B6B67",
          600: "#555552",
          700: "#3F3F3C",
          800: "#2A2A28",
          900: "#1A1A18",
          950: "#0F0F0E",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#FAFAF8",
          warm: "#F8F6F2",
          card: "#FFFFFF",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px rgba(26, 26, 24, 0.04), 0 1px 2px rgba(26, 26, 24, 0.03)",
        card: "0 4px 20px rgba(26, 26, 24, 0.06), 0 1px 3px rgba(26, 26, 24, 0.04)",
        elevated: "0 12px 40px rgba(26, 26, 24, 0.1), 0 4px 12px rgba(26, 26, 24, 0.05)",
        header: "0 1px 0 rgba(26, 26, 24, 0.06), 0 4px 16px rgba(26, 26, 24, 0.04)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.3s ease-out forwards",
        "heart-pop": "heartPop 0.35s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        heartPop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.25)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;

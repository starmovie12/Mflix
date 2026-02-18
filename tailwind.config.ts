import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: "#050505",
        netflix: "#E50914",
        "netflix-dark": "#B20710",
        surface: {
          DEFAULT: "#141414",
          light: "#1a1a1a",
          lighter: "#222222",
          border: "#2a2a2a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "fluid-sm": "clamp(0.8rem, 0.75rem + 0.25vw, 0.875rem)",
        "fluid-base": "clamp(0.875rem, 0.8rem + 0.4vw, 1rem)",
        "fluid-lg": "clamp(1.125rem, 1rem + 0.5vw, 1.25rem)",
        "fluid-xl": "clamp(1.25rem, 1rem + 1vw, 1.5rem)",
        "fluid-2xl": "clamp(1.5rem, 1.2rem + 1.5vw, 2rem)",
        "fluid-3xl": "clamp(1.875rem, 1.3rem + 2.5vw, 3rem)",
        "fluid-4xl": "clamp(2.25rem, 1.5rem + 3.5vw, 3.75rem)",
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
      boxShadow: {
        card: "0 18px 32px rgba(0, 0, 0, 0.45)",
        "card-hover": "0 24px 48px rgba(0, 0, 0, 0.6)",
        glow: "0 0 20px rgba(229, 9, 20, 0.3)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.7) 50%, rgba(5,5,5,0.3) 100%)",
        "hero-vignette":
          "linear-gradient(to right, rgba(5,5,5,0.9) 0%, transparent 50%, rgba(5,5,5,0.4) 100%)",
        "fade-up": "linear-gradient(to top, rgba(5,5,5,1) 0%, transparent 100%)",
        "fade-down": "linear-gradient(to bottom, rgba(5,5,5,1) 0%, transparent 100%)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
      },
      aspectRatio: {
        poster: "2 / 3",
        backdrop: "16 / 9",
      },
    },
  },
  plugins: [],
};

export default config;

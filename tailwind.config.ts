import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        pitch: "#050505",
        netflix: "#E50914"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 18px 32px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.7) 50%, rgba(5,5,5,0.3) 100%)"
      }
    }
  },
  plugins: []
};

export default config;

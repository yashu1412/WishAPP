import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6D28D9",
        secondary: "#8B5CF6",
        accent: "#EC4899",
        background: "#0F172A",
        surface: "#111827",
        "text-primary": "#FFFFFF",
        "text-secondary": "#94A3B8",
        border: "rgba(255,255,255,0.08)",
      },
      borderRadius: {
        "3xl": "1.5rem",
      },
      boxShadow: {
        "glow-purple": "0 0 30px rgba(109, 40, 217, 0.5)",
        "glow-pink": "0 0 30px rgba(236, 72, 153, 0.5)",
        "card-lg": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        "card-xl": "0 35px 60px -15px rgba(0, 0, 0, 0.6)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "bounce-gentle": "bounce 2s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

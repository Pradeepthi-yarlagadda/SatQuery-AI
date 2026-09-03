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
        space: "#050814",
        "space-glow": "#0a1229",
        nebula: "#6366f1",
        orbit: "#8b5cf6",
        glass: "rgba(15, 23, 42, 0.45)",
        "glass-border": "rgba(148, 163, 184, 0.15)",
        "slate-line": "rgba(148, 163, 184, 0.25)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#6366f1",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "rgba(148, 163, 184, 0.2)",
          foreground: "#94a3b8",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

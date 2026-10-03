import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#05060f",
        panel: "#0b0d1c",
        neon: { cyan: "#22d3ee", purple: "#a855f7", pink: "#f472b6" },
      },
      fontFamily: {
        sans: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        cyan: "0 0 32px -6px rgba(34,211,238,0.55)",
        purple: "0 0 32px -6px rgba(168,85,247,0.55)",
      },
    },
  },
  plugins: [],
};
export default config;

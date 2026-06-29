import type { Config } from "tailwindcss";

// Tailwind wordt enkel voor layout-utilities gebruikt. De merkkleuren komen uit
// CSS-variabelen (zie app/layout.tsx + config/branding.ts), niet uit dit bestand.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;

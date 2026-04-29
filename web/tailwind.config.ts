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
        background: "#0A0A0A",
        foreground: "#ededed",
        accent: {
          DEFAULT: "#9EFF82",
          foreground: "#000000",
        },
        card: "#121212",
        border: "#262626"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-fira-code)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sply: {
          bg: {
            dark: "#0F0F0F",
            light: "#FAFAFA",
          },
          surface: {
            dark: "#1C1C1C",
            light: "#FDFDFD",
          },
          border: {
            dark: "#2E2E2E",
            light: "#E3E3E3",
          },
          muted: {
            dark: "#909090",
            light: "#797979",
          },
          sale: "#E2231A",
        },
      },
      fontFamily: {
        mono: ["var(--font-red-hat-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      transitionTimingFunction: {
        studio: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

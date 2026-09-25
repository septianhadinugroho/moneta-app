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
        moneta: {
          primary: "#0F3D34",   // Deep Forest Green
          secondary: "#16A085", // Emerald Teal
          accent: "#22C55E",    // Vibrant Mint Green
          bg: "#E6F7EF",        // Light Soft Mint Background
        },
      },
    },
  },
  plugins: [],
};
export default config;
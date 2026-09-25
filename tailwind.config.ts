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
          primary: "#064E3B",   // Emerald Dark
          secondary: "#059669", // Emerald Medium
          surface: "#F8FAFC",   // Clean Slate Light
          card: "#FFFFFF",
          rose: "#E11D48",      // Soft Rose untuk Expense
        },
      },
    },
  },
  plugins: [],
};
export default config;
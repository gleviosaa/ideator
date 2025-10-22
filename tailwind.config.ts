import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Uber-inspired color palette
        uber: {
          black: "#000000",
          white: "#FFFFFF",
          gray: {
            50: "#F6F6F6",
            100: "#EEEEEE",
            200: "#E2E2E2",
            300: "#CBCBCB",
            400: "#AFAFAF",
            500: "#6B6B6B",
            600: "#545454",
            700: "#333333",
            800: "#1A1A1A",
            900: "#0D0D0D",
          },
        },
      },
      borderRadius: {
        'uber': '8px',
        'uber-lg': '12px',
        'uber-xl': '16px',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'uber': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'uber-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'uber-xl': '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
export default config;

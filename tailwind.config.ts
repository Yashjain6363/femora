import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "'Plus Jakarta Sans'",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "'Playfair Display'",
          "Georgia",
          "serif",
        ],
      },
      colors: {
        fermora: {
          bg: "#F8F3E9", // Warm Ivory base
          surface: "#FAF7F2", // Soft Alabaster surface (never pure white)
          surfaceElevated: "#FDFBF7",
          surfaceMuted: "#F5EFE4", // Tonal Linen
          text: "#101F3B", // Deep Navy primary text
          navy: "#101F3B",
          mutedNavy: "#26334A", // Muted Navy secondary
          orchid: "#B66ACB", // Primary accent
          softLavender: "#E6DDF4", // Secondary accent
          lavender: "#D1BDF2",
          blush: "#F2DCE7",
          mutedRose: "#EBD9CC",
          beige: "#E8DFD5", // Refined architectural borders
        },
        obsidian: {
          DEFAULT: "#F8F3E9",
          50: "#FAF7F2",
          100: "#F5EFE4",
          200: "#EBD9CC",
          300: "#D1BDF2",
          400: "#B66ACB",
          500: "#7A3E8E",
          600: "#26334A",
          700: "#1E2A3E",
          800: "#152238",
          900: "#101F3B",
          950: "#0A1325",
        },
        rose: {
          DEFAULT: "#B66ACB",
          50: "#FBF7FD",
          100: "#F2DCE7",
          200: "#E6DDF4",
          300: "#D1BDF2",
          400: "#C488D6",
          500: "#B66ACB",
          600: "#9C4EB3",
          700: "#7F3696",
          800: "#602573",
          900: "#451654",
        },
        violet: {
          DEFAULT: "#B66ACB",
          50: "#FAF7FD",
          100: "#E6DDF4",
          200: "#D1BDF2",
          300: "#B66ACB",
          400: "#9E4FBF",
          500: "#8637A7",
          600: "#6D258C",
          700: "#551A6E",
          800: "#3F1153",
          900: "#2B0B39",
        },
        gold: {
          DEFAULT: "#D4A373",
          light: "#EBD9CC",
          dark: "#A66D38",
        },
      },
      borderRadius: {
        // Restrained corner radii for architectural, editorial elegance
        sm: "0.25rem",
        DEFAULT: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      animation: {
        "fade-up": "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "128": "32rem",
      },
    },
  },
  plugins: [],
};

export default config;

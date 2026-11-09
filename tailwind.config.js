/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./services/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF9F6",
        surface: "#FFFFFF",
        stone: {
          DEFAULT: "#F3F2EE",
          dark: "#E8E7E2",
        },
        ink: {
          DEFAULT: "#111111",
          secondary: "#2B2A27",
        },
        muted: {
          DEFAULT: "#686763",
          light: "#8F8E8A",
        },
        hairline: {
          DEFAULT: "#E4E3DF",
          dark: "#D1D0CB",
        },
        sale: {
          DEFAULT: "#9E2A2B",
          dark: "#802223",
          light: "#FDF2F2",
        },
        forest: {
          DEFAULT: "#1B4332",
          light: "#E8F5E9",
        },
        amber: {
          DEFAULT: "#B45309",
          light: "#FEF3C7",
        },
        destructive: {
          DEFAULT: "#991B1B",
          light: "#FEE2E2",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        editorial: [
          "Didot",
          "Bodoni MT",
          "Cinzel",
          "Georgia",
          "serif",
        ],
      },
      aspectRatio: {
        portrait: "3 / 4",
        tile: "4 / 5",
        banner: "16 / 9",
        wide: "21 / 9",
      },
      letterSpacing: {
        micro: "0.14em",
        tightest: "-0.03em",
      },
      maxWidth: {
        storefront: "1440px",
      },
      borderRadius: {
        none: "0px",
      },
    },
  },
  plugins: [],
};

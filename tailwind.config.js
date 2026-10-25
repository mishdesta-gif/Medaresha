/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          950: "#1A1E15",
          900: "#24291D",
          DEFAULT: "#343B2A",
          800: "#343B2A",
          700: "#444D37",
          600: "#576246",
          500: "#6C7A58",
        },
        botanical: {
          DEFAULT: "#72785E",
          light: "#8E9578",
          pale: "#E4E8DC",
          soft: "#F1F4ED",
        },
        ivory: {
          DEFAULT: "#F5F0E6",
          light: "#FAF7F2",
          dark: "#EDE6D8",
        },
        sand: {
          DEFAULT: "#E8DFD0",
          light: "#F0E9DC",
          dark: "#D6CABA",
        },
        meda: {
          text: "#292A24",
          muted: "#77766C",
          subtle: "#A3A196",
          border: "#D8D0C3",
          card: "#EDE5D6",
          darkbg: "#1D2118",
        },
        status: {
          clean: { bg: "#EAF3ED", text: "#245C3C", border: "#BDE2CD" },
          dirty: { bg: "#FBEAE9", text: "#9B2C24", border: "#F5C2BF" },
          progress: { bg: "#FBF4E8", text: "#9A6517", border: "#F6DFB6" },
          inspected: { bg: "#EBF2F7", text: "#245070", border: "#BFD8E8" },
          maintenance: { bg: "#F0EFF4", text: "#4E486B", border: "#D2D0DF" },
        }
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        'luxury': '1.25rem',
        'pill': '9999px',
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(52, 59, 42, 0.04)',
        'elevated': '0 10px 30px -10px rgba(52, 59, 42, 0.08)',
        'modal': '0 20px 50px -15px rgba(52, 59, 42, 0.18)',
      }
    },
  },
  plugins: [],
};

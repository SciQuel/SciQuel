/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shrink: {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
      },
      fontFamily: {
        alegreyaSansSC: "var(--font-alegreya-sans-sc)",
        sourceSerif4: "var(--font-source-serif-4)",
        customTest: ["custom-test", "sans-serif"],
        besley: "var(--font-besley)",
        quicksand: "var(--font-quicksand)",
      },
      colors: {
        sciquelDarkText: "#333333",
        sciquelTeal: "#194b52",
        sciquelFooter: "#255363",
        sciquelHover: "#256670",
        sciquelHeading: "rgba(52, 78, 65, 1)",
        sciquelMuted: "#727272",
        sciquelCaption: "#565656",
        sciquelCitation: "#8c8c8c",
        sciquelCardBg: "#f8f8ff",
        sciquelCardBorder: "#cccccc",
        sciquelMuted2: "#58A4B0",
        sciquelGreen: "#A3C9A8",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      transitionProperty: {
        spacing: "margin, padding",
        position: "top, left, right, bottom",
      },
      screens: {
        xs: "350px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("tailwindcss-touch")(),
  ],
};

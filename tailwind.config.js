/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        alegreyaSansSC: "var(--font-alegreya-sans-sc)",
        sourceSerif4: "var(--font-source-serif-4)",
      },

      screens: {
        'h-sm': { 'raw': '(max-height: 568px)' },    // Small mobile devices
        'h-md': { 'raw': '(min-height: 569px)' },    // Medium mobile devices
        'h-lg': { 'raw': '(min-height: 668px)' },    // Large mobile devices
        'h-xl': { 'raw': '(min-height: 1024px)' },   // Tablets
        'h-2xl': { 'raw': '(min-height: 1280px)' },  // Small laptops
        'h-3xl': { 'raw': '(min-height: 1280px)' },  // Desktops
      },
   
      colors: {
        sciquelDarkText: "#333333",
        sciquelTeal: "#109191",
        sciquelFooter: "#5C9EAD",
        sciquelHover: "#51726b",
        sciquelHeading: "rgba(52, 78, 65, 1)",
        sciquelMuted: "#878787",
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
    },
  },
  plugins: [require("@tailwindcss/container-queries"), require("tailwindcss-touch")()],
};

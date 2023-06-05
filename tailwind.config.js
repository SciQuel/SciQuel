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
      colors: {
        sciquelDarkText: "#333333",
        sciquelTeal: "#69a297",
        sciquelHover: "#51726b",
        sciquelHeading: "rgba(52, 78, 65, 1)",
        sciquelMuted: "#878787",
        sciquelCardBg: "#f8f8ff",
        sciquelCardBorder: "#cccccc",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

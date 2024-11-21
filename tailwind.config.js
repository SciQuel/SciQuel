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
      },
      colors: {
        sciquelDarkText: "#333333",
        sciquelTeal: "#194b52",
        sciquelFooter: "#255363",
        sciquelHover: "#256670",
        sciquelHeading: "rgba(52, 78, 65, 1)",
        sciquelMuted: "#878787",
        sciquelCaption: "#565656",
        sciquelCitation: "#8c8c8c",
        sciquelCardBg: "#f8f8ff",
        sciquelCardBorder: "#cccccc",
        sciquelCorrectBG: "#A9DFA5",
        sciquelCorrectText: "#437e64",
        sciquelIncorrectBG: "#FBA7AC",
        sciquelIncorrectText: "#d06363",        
        sciquelMuted2: "#58A4B0",
        sciquelGreen: "#A3C9A8",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        // '2xl': {'max': '1535px'},
        // // => @media (max-width: 1535px) { ... }
  
        // 'xl': {'max': '1279px'},
        // // => @media (max-width: 1279px) { ... }
  
        // 'lg': {'max': '1023px'},
        // // => @media (max-width: 1023px) { ... }
  
        'md-qz': {'max': '767px'},
        // => @media (max-width: 767px) { ... }
  
        'sm-qz': {'max': '639px'},
        // => @media (max-width: 639px) { ... }
  
        'sm-mm': {'max': '510px'},
        // => @media (max-width: 639px) { ... }
        
        'xsm-qz': {'max': '439px'},
        // => @media (max-width: 639px) { ... }
  
        'xsm-mm': {'max': '370px'},
        // => @media (max-width: 639px) { ... }
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

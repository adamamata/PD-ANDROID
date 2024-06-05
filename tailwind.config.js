/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        jaldi: ["Jaldi", "sans-serif"],
      },
      screens: {
        "2xl": "1400px",
        "3xl": "1750px",
        // => @media (min-width: 992px) { ... }
        'custombp': { 'raw': '(min-width:1400px) and (min-height: 900px)' },
        // => @media (min-height: 900px) { ... }
        'tall': { 'raw': '(min-height: 700px)' },
      },

      colors: {
        primary: "#37085B",
        borderlight: "#37085B",
        boderDark: "#37085B",
        btnprimary: "#37085B",
        secondary: "#6e37be"
        // background: "linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), linear-gradient(116.97deg, rgba(225, 245, 242, 0.9) 0%, rgba(107, 197, 210, 0.9) 99.59%);",
      },

      boxShadow: {
        "3x3": "0px 4px 25px rgba(0, 0, 0, 0.25)",
      },
      spacing: {
        '15': '3.75rem'
      }
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ]
};
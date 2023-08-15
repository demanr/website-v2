/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ["Red Hat Display", "Inter", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        'card-bg': "url('/public/cardBackground.svg')",
      },
      colors: {
          'light': '#D42C4B',
          'heavy': '#8B2237', 
        },
      keyframes: {
        fade: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        wiggle: {
          '0': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '70%': { transform: 'rotate(3deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        wiggleReverse: {
          '0': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(3deg)' },
          '70%': { transform: 'rotate(-3deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        animation: {
          "fade-in-s": "fade 4.5s ease-in-out",
        },

      },

      animation: {
        spinSlow: "spin 8s linear infinite",
        spinDJ: "spin 4s ease infinite",
        spinTest: "spin 10s linear infinite",
        spinOposite: "spin 10s linear infinite reverse",
        slideIn: "slideIn 3.25s ease-in-out forwards infinite",
        wiggle: "wiggle 10s infinite",
        wingleReverse: "wiggleReverse 10s infinite",
      },
    },
    variants: {},
    plugins: [],
  },
};

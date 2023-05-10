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
      keyframes: {
        fade: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        animation: {
          "fade-in-s": "fade 4.5s ease-in-out",
        },
      },

      animation: {
        spinSlow: "spin 8s linear infinite",
        spinDJ: "spin 4s ease infinite",
      },
    },
    variants: {},
    plugins: [],
  },
};

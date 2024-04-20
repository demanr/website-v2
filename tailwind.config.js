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
      sans: ["Red Hat Display", "Inter", "sans-serif"],
    },
      backgroundImage: {
        "card-bg": "url('/public/cardBackground.svg')",
      },
      colors: {
        light: "#D42C4B",
        heavy: "#8B2237",
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
          0: { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "70%": { transform: "rotate(3deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        wiggleColour: {
          0: { transform: "rotate(0deg)", backgroundPosition: '0% 50%' },
          "25%": { transform: "rotate(-1deg)" },
          "50%": {backgroundPosition: '100% 50%'},
          "70%": { transform: "rotate(-3deg)" },
          "100%": { transform: "rotate(0deg)", backgroundPosition: '0% 50%' },
        },
        wiggleColourReverse: {
          0: { transform: "rotate(0deg)", backgroundPosition: '0% 50%' },
          "25%": { transform: "rotate(1deg)" },
          "50%": {backgroundPosition: '100% 50%'},
          "70%": { transform: "rotate(3deg)" },
          "100%": { transform: "rotate(0deg)", backgroundPosition: '0% 50%' },
        },
        wiggleColourMobile: {
          0: { transform: "rotate(0deg)", backgroundPosition: '0% 50%' },
          "25%": { transform: "rotate(-1deg)" },
          "50%": {backgroundPosition: '100% 50%'},
          "70%": { transform: "rotate(-4deg)" },
          "100%": { transform: "rotate(0deg)", backgroundPosition: '0% 50%' },
        },
        wiggleColourReverseMobile: {
          0: { transform: "rotate(0deg)", backgroundPosition: '0% 50%' },
          "25%": { transform: "rotate(1deg)" },
          "50%": {backgroundPosition: '100% 50%'},
          "70%": { transform: "rotate(4deg)" },
          "100%": { transform: "rotate(0deg)", backgroundPosition: '0% 50%' },
        },
        wiggleReverse: {
          0: { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(3deg)" },
          "70%": { transform: "rotate(-3deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        wiggleB: {
          0: { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(0deg)" },
          "75%": { transform: "rotate(2deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        wiggleBReverse: {
          0: { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(2deg)" },
          "50%": { transform: "rotate(0deg)" },
          "75%": { transform: "rotate(-2deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        jello: {
          "from, 11.1%, to": {
            transform: "translate3d(0, 0, 0)",
          },
          "22.2%": {
            transform: "skewX(-12.5deg) skewY(-12.5deg)",
          },
          "33.3%": {
            transform: "skewX(6.25deg) skewY(6.25deg)",
          },
          "44.4%": {
            transform: "skewX(-3.125deg) skewY(-3.125deg)",
          },
          "55.5%": {
            transform: "skewX(1.5625deg) skewY(1.5625deg)",
          },
          "66.6%": {
            transform: "skewX(-0.78125deg) skewY(-0.78125deg)",
          },
          " 77. 7%": {
            transform: "skewX(0.390625deg) skewY(0.390625deg)",
          },
          "88.8%": {
            transform: "skewX(-0.1953125deg) skewY(-0.1953125deg)",
          },
          
        },
        background: {
            '0%, 100%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
      },
        animation: {
          "fade-in-s": "fade 4.5s ease-in-out",
        },
      },

      animation: {
        spinSlow: "spin 8s linear infinite",
        spinDJ: "spin 4s ease infinite",
        spinConst: "spin 8s linear infinite",
        spinTest: "spin 10s linear infinite",
        spinOposite: "spin 10s linear infinite reverse",
        slideIn: "slideIn 3.25s ease-in-out forwards infinite",
        wiggle: "wiggle 10s infinite",
        wingleReverse: "wiggleReverse 10s infinite",
        wiggleB: "wiggleB 10s infinite",
        wiggleBReverse: "wiggleBReverse 10s infinite",
        jello: "jello 1s infinite",
        bg: "wiggleColour ease-in-out 8s infinite",
        bgReverse: "wiggleColourReverse ease-in-out 8s infinite",
        bgMobile: "wiggleColourMobile ease-in-out 8s infinite",
        bgReverseMobile: "wiggleColourReverseMobile ease-in-out 8s infinite"
      },
    },
    variants: {},
    plugins: [],
  },
};

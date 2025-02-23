module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // adjust as necessary
  ],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "fade-in": "fadeIn 2s ease-in-out",
        "slide-up": "slideUp 1s ease-out",
        "car-move": "carMove 4s linear infinite",
        "pulse-fast": "pulseFast 1.5s ease-in-out infinite",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        "slide-out-right": "slideOutRight 0.5s ease-out forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "slide-out-left": "slideOutLeft 0.5s ease-out forwards",
        typewriter:
          "typewriter 2s steps(40) normal both, blink 1s step-end infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        carMove: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100vw)" },
        },
        pulseFast: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        typewriter: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        blink: {
          "50%": { borderColor: "transparent" },
          "100%": { borderColor: "black" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOutLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
};

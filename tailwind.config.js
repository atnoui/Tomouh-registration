/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep indigo-navy pulled from the Tomouh mark
        navy: {
          950: "#0A0933",
          900: "#100E4D",
          800: "#17148C",
          700: "#221CA8",
          600: "#3229C4",
        },
        // Flame orange — matches the brand's own extracted accent (#EF6C03)
        flame: {
          300: "#FFC08A",
          400: "#FF9142",
          500: "#EF6C03",
          600: "#C95602",
        },
        cream: {
          50: "#FBF9F4",
          100: "#F4F0E6",
        },
        ink: "#14122E",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "flame-glow":
          "radial-gradient(60% 60% at 50% 35%, rgba(239,108,3,0.35) 0%, rgba(239,108,3,0) 70%)",
        "navy-gradient":
          "linear-gradient(160deg, #0A0933 0%, #17148C 55%, #221CA8 100%)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,18,46,0.06), 0 8px 24px rgba(20,18,46,0.08)",
      },
    },
  },
  plugins: [],
};

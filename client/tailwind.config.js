/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        light: "#F4F6F9",
        dark: "#1B1B1B",
        global: "#D8DADD",
        inner: "#F4F6F9",
        design: "#D4D6D8",
        disappeared: "#EBEEF1",
        actionBar: "#DCE0E4",
        theme: "#FFF9F2"
      },
      backgroundImage: {
        nav: 'linear-gradient(180deg, rgba(255,249,242,1) 0%, rgba(213,246,254,1) 100%);'
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;

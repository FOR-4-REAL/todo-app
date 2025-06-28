import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(240 5% 91%)",
        input: "hsl(240 5% 96%)",
        ring: "hsl(240 5% 83%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(240 10% 3.9%)",
        primary: {
          DEFAULT: "hsl(240 5% 40%)",
          foreground: "hsl(0 0% 100%)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
      },
    },
  },
  plugins: [import("tailwindcss-animate")],
};

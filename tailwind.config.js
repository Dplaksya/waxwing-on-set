/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

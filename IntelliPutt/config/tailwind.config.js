/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/*.js", "./components/*.js"],
  theme: {
    extend: {
      backgroundImage: {
        'golf': "url('../static/images/background.jpg')",
      },
      colors: {
        "brand-colorbroken-white": "var(--brand-colorbroken-white)",
        "brand-colordark-green": "#093923",
      },
      backgroundColor: {
        "brand-colorbroken-white": "var(--brand-colorbroken-white)",
        "brand-colordark-green": "#093923",
      },
    },
  },
  plugins: [],
}


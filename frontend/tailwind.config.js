/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '90%': '90%',
        "10%":"10%",
        "41":"41px"
      },
      width:{
        '90%': '90%',
        "10%":"10%",
        "20":"20%"
      }
    },
  },
  plugins: [],
}
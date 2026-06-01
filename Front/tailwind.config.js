/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // parte DO jhon tirar:
    extend: {
      keyframes: {
        fall: {
          "0%": {
            transform: "translate(0px, 0px)",
            opacity: "1",
          },
          "100%": {
            transform: "translate(100vw, 90vh)",
            opacity: "0",
          },
        },
      },
      animation: {
        fall: "fall 2s linear forwards",
      },
    },
    //Fim da parte do jhon

  },
  plugins: [],
}

/** @type {import("tailwindcss").Config} */
const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07111f"
        }
      },
      boxShadow: {
        glow: "0 24px 80px rgba(51, 65, 85, 0.28)"
      }
    }
  },
  plugins: []
};

module.exports = config;

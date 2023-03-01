/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [],
  theme: {
    screens: {
      sm: { max: "600px" },
      tb: { max: "900px", min: "600px" },
      tab: { max: "800px" },
      a900: {
        min: "900px"
      },
      b900: {
        max: "900px"
      },
      b1000: {
        max: "1000px"
      },
      a800: {
        min: "800px"
      },
      a1000: {
        min: "1000px"
      },
      b800: {
        max: "800px"
      },
      tabDispay: { max: "1200px", min: "800px" },
      web: { min: "800px" },
      nsm: { min: "600px" },
      max800: { max: "800px" },
      min800: { min: "800px" },
      tb: { max: "800px", min: "600px" },
      tab: { max: "800px" },
      web: { min: "1200px" },
      nsm: { min: "600px" },
      min800: { min: "800px" },
      max800: { max: "800px" },
      min1000: { min: "1000px" },
      max1000: { max: "1000px" },
      b1200: {
        max: "1200px",
      },
      a1200: {
        min: "1200px",
      },
      shareModal: { max: "425px" },
    },
    colors: {
      1: "#ffffff",
      2: "#808191",
      3: "#C3C2D4",
      4: "#6f6e84",
      5: "F7F7F7",
      "blue-1": "#5973fe",
      "blue-2": "#0788e6",
      "light-blue": "#99D5EF",
      "buffer-blue": "#A3E3FF",
      green: "#3fb68b",
      red: "#ff5353",
      grey: "#353945",
      "light-border": "#2A2A3A",
      transparent: "transparent",
    },
    backgroundColor: {
      primary: "#1c1c28",
      "cross-bg": "#303044",
      1: "#232334",
      2: "#171722",
      3: "#12121a",
      4: "#1D2027",
      5: "#1C1C28",
      grey: "#353945",

      green: "#3fb68b",
      red: "#ff5353",
      blue: "#3772ff",
      transparent: "transparent",
    },
    extend: {
      spacing: {
        1: "2px",
        2: "4px",
        3: "8px",
        4: "12px",
        5: "16px",
        6: "24px",
        7: "32px",
        8: "48px",
      },
    },
    borderColor: {
      1: "#2a2a3a",
    },
    fontSize: {
      f10: "10px",
      f11: "11px",
      f12: "12px",
      f13: "13px",
      f14: "14px",
      f15: "15px",
      f16: "16px",
      f20: "20px",
      f18: "18px",
      f22: "22px",
      f24: "24px",
    },
    spacing: {
      1: "2px",
      2: "4px",
      3: "8px",
      4: "12px",
      5: "16px",
      6: "24px",
      7: "32px",
      8: "48px",
    },
    borderRadius: {
      none: "0",
      sm: "4px",
      DEFAULT: "0.25rem",
      DEFAULT: "4px",
      md: "8px",
      lg: "12px",
      full: "9999px",
      large: "16px",
    },
  },
};

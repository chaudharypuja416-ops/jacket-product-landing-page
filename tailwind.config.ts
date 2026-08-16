import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: "#211713",
        leather: "#8b4a24",
        cognac: "#c47a3d",
        linen: "#f5eee7",
        ivory: "#fffaf5",
        mist: "#eef3f1",
        sage: "#48685a",
        charcoal: "#171717",
      },
      boxShadow: {
        premium: "0 24px 80px rgba(33, 23, 19, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;

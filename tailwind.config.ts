import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        petal: {
          canvas: "#FAFAF9",
          card: "#FFFFFF",
          subtle: "#F5F3FF",
          rose: "#FB7185",
          lavender: "#A78BFA",
          sky: "#38BDF8",
          sage: "#6EE7B7",
          text: {
            primary: "#1C1917",
            secondary: "#78716C",
            tertiary: "#A8A29E",
          },
          border: {
            DEFAULT: "#E7E5E4",
            hover: "#D6D3D1",
          },
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        dm: ["var(--font-dm)", "sans-serif"],
      },
      borderRadius: {
        section: "24px",
        card: "20px",
        button: "9999px",
        input: "14px",
        thumbnail: "16px",
        badge: "9999px",
      },
      boxShadow: {
        "card-resting": "0 2px 12px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 8px 32px rgba(0, 0, 0, 0.10)",
        "btn-active": "0 2px 8px rgba(251, 113, 133, 0.35)",
      },
      transitionProperty: {
        all: "all",
      },
      transitionTimingFunction: {
        ease: "ease",
      },
      transitionDuration: {
        "200": "200ms",
      },
    },
  },
  plugins: [],
};

export default config;

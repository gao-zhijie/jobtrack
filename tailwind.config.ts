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
        // Linear-inspired palette
        primary: "#5E6AD2",
        background: "#FAFBFC",
        card: "#FFFFFF",
        border: "#E6E8EB",
        "text-primary": "#1C1D1F",
        "text-secondary": "#6F7177",
        "text-muted": "#B4B6BA",

        // Status colors
        applied: "#6F7177",
        written: "#D97706",
        interviewing: "#5E6AD2",
        final: "#7C3AED",
        offer: "#059669",
        ended: "#B4B6BA",
        danger: "#DC2626",
        "danger-bg": "#FEF3F2",

        // Semantic aliases
        foreground: "#1C1D1F",
        muted: "#B4B6BA",
        accent: "#5E6AD2",
      },
      borderRadius: {
        DEFAULT: "8px",
        card: "12px",
        button: "6px",
      },
      fontSize: {
        "2xs": "12px",
        xs: "13px",
        sm: "14px",
        base: "16px",
        lg: "20px",
        xl: "28px",
        "2xl": "48px",
      },
      spacing: {
        "4.5": "18px",
      },
      lineHeight: {
        tight: "1.3",
        normal: "1.6",
        relaxed: "1.8",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
      },
      transitionDuration: {
        200: "200ms",
      },
    },
  },
  plugins: [],
};

export default config;

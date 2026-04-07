import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--stone-200)",
        input: "var(--stone-200)",
        ring: "var(--primary)",
        background: "var(--bg-warm)",
        foreground: "var(--text-dark)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--white)",
        },
        secondary: {
          DEFAULT: "var(--stone-100)",
          foreground: "var(--text-dark)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "var(--stone-100)",
          foreground: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--stone-100)",
          foreground: "var(--text-dark)",
        },
        popover: {
          DEFAULT: "var(--white)",
          foreground: "var(--text-dark)",
        },
        card: {
          DEFAULT: "var(--white)",
          foreground: "var(--text-dark)",
        },
      },
      borderRadius: {
        lg: "var(--border-radius-lg)",
        md: "var(--border-radius)",
        sm: "calc(var(--border-radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

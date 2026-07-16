// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Core light backgrounds
        "primary-bg": "#EAE4CF",
        "secondary-bg": "#D8D2BC",
        "surface": "#FFFFFF",
        // Text
        "primary-text": "#2A2621",
        "secondary-text": "#5A554E",
        // Borders
        "border": "#D8D2BC",
        // Neon accent (reserved for CTA, FAB, QR)
        "neon-green": "#FD5C05",
        // Brand accent colors
        "electric-blue": "#FD5C05",
        "coral": "#2A2621",
        "neon-lime": "#FD5C05",
        // Gradient colors (for utilities)
        "gradient-primary-start": "#FB1C07",
        "gradient-primary-end": "#FC7C0B",
        "gradient-secondary": "#FD5C05",
        "gradient-pink": "#FB1C07",
        "gradient-purple": "#2A2621",
        "gradient-blue": "#EAE4CF",
        "gradient-green": "#FD5C05"
      },
      spacing: {
        // 8‑point system (4px base)
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "7": "28px",
        "8": "32px",
        "9": "36px",
        "10": "40px",
        "11": "44px",
        "12": "48px"
      },
      borderRadius: {
        "large": "28px",
        "pill": "9999px",
        "default": "8px"
      },
      boxShadow: {
        "glass": "0 4px 12px rgba(0,0,0,0.25)",
        "card": "0 8px 20px rgba(0,0,0,0.3)",
        "card-hover": "0 12px 30px rgba(0,0,0,0.45)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      fontSize: {
        'hero': ['48px', { lineHeight: '1.05', letterSpacing: '-0.05em' }],
        'page-title': ['40px', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
        'section-heading': ['32px', { lineHeight: '1.15', letterSpacing: '-0.03em' }],
        'card-title': ['24px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'subtitle': ['20px', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        'body-text': ['16px', { lineHeight: '1.5' }],
        'caption': ['14px', { lineHeight: '1.4' }],
        'small-label': ['12px', { lineHeight: '1.3' }],
        'button-text': ['16px', { lineHeight: '1.2', letterSpacing: '0.05em' }]
      },
      backgroundImage: {
        // Gradient utilities
        "gradient-primary": "linear-gradient(135deg, var(--tw-color-gradient-primary-start), var(--tw-color-gradient-primary-end))",
        "gradient-purple-pink": "linear-gradient(135deg, var(--tw-color-gradient-purple), var(--tw-color-gradient-pink))",
        "gradient-blue-purple": "linear-gradient(135deg, var(--tw-color-gradient-blue), var(--tw-color-gradient-purple))",
        "gradient-purple-blue": "linear-gradient(135deg, var(--tw-color-gradient-purple), var(--tw-color-gradient-blue))"
      },
      keyframes: {
        "float-glow": {
          "0%, 100%": { transform: "translateY(0)", "box-shadow": "0 5px 15px rgba(0,0,0,0.3), 0 0 10px rgba(255,122,26,0.1)" },
          "50%": { transform: "translateY(-5px)", "box-shadow": "0 15px 30px rgba(0,0,0,0.5), 0 0 20px rgba(255,122,26,0.3)" }
        }
      },
      animation: {
        "float-glow": "float-glow 4s infinite ease-in-out"
      }
    }
  },
  plugins: []
};

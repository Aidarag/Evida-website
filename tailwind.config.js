// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        "brand-orange": "#FF7A1A",
        "brand-yellow": "#FFD214",
        "brand-cream": "#F5EFEB",
        // UI palette
        "primary-bg": "#050507",
        "primary-fg": "#f8fafc",
        "card-bg": "rgba(13,13,16,0.7)",
        "border": "rgba(255,255,255,0.05)",
        "accent": "#FF6B2C", // main Evida accent (warm orange)
        "soft-orange": "rgba(255,122,26,0.2)"
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
        "card": "24px", // rounded-3xl equivalent
        "poster": "28px",
        "btn": "9999px",
        "default": "8px"
      },
      boxShadow: {
        "card": "0 5px 15px rgba(0,0,0,0.3), 0 0 10px rgba(255,122,26,0.1)",
        "card-hover": "0 20px 40px -15px rgba(0,0,0,0.7), 0 0 30px -5px rgba(255,122,26,0.15)",
        "poster-hover": "0 30px 60px -20px rgba(0,0,0,0.8), 0 0 40px -10px rgba(255,122,26,0.2)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      animation: {
        "float-glow": "float-glow 4s infinite ease-in-out"
      },
      keyframes: {
        "float-glow": {
          "0%, 100%": { transform: "translateY(0)", "box-shadow": "0 5px 15px rgba(0,0,0,0.3), 0 0 10px rgba(255,122,26,0.1)" },
          "50%": { transform: "translateY(-5px)", "box-shadow": "0 15px 30px rgba(0,0,0,0.5), 0 0 20px rgba(255,122,26,0.3)" }
        }
      }
    }
  },
  plugins: []
};

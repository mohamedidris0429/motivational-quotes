/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        script: ['"Dancing Script"', 'cursive'],
        display: ['"Cormorant Garamond"', 'serif'],
      },
      colors: {
        lavender: {
          50: '#f6f3ff', 100: '#ede8ff', 200: '#ddd3ff', 300: '#c4b5ff',
          400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9',
          800: '#5b21b6', 900: '#4c1d95',
        },
        cream: {
          50: '#fdfbf7', 100: '#faf5ec', 200: '#f5ebd9',
        },
        navy: {
          800: '#1e1b4b', 900: '#0f0e2a', 950: '#080717',
        },
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(124, 58, 237, 0.18)',
        card: '0 8px 40px -12px rgba(76, 29, 149, 0.25)',
        glow: '0 0 40px rgba(167, 139, 250, 0.35)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: 0, transform: 'scale(0.95)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
        scaleIn: 'scaleIn 0.4s ease-out',
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
        merriweather: ['Merriweather', 'Georgia', 'serif'],
        roboto: ['Roboto', 'Arial', 'sans-serif'],
        lato: ['Lato', 'Arial', 'sans-serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        source: ['"Source Sans Pro"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        paper: '0 24px 60px rgba(15, 23, 42, 0.18)',
      },
      keyframes: {
        toastIn: { '0%': { transform: 'translateY(-8px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      animation: {
        toastIn: 'toastIn .22s ease-out',
        fadeIn: 'fadeIn .25s ease-out',
      },
    },
  },
  plugins: [],
};

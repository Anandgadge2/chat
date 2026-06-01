/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          teal: '#075E54',
          darkTeal: '#128C7E',
          green: '#25D366',
          beige: '#ECE5DD',
          lightGreen: '#DCF8C6',
          white: '#FFFFFF',
          input: '#F0F0F0',
          blue: '#34B7F1',
        },
        primary: '#128C7E',
        secondary: '#25D366',
        light: '#f3f4f6',
        border: '#e5e7eb',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

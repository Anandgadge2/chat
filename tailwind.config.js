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
          teal: '#0f766e',
          darkTeal: '#075e54',
          green: '#25d366',
          beige: '#f3f4ef',
          lightGreen: '#dcf8c6',
          white: '#FFFFFF',
          input: '#f8fafc',
          blue: '#34b7f1',
        },
        primary: '#0f766e',
        secondary: '#25d366',
        accent: '#0891b2',
        success: '#10b981',
        light: '#f3f4ef',
        border: '#e2e8f0',
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
      boxShadow: {
        'soft': '0 2px 8px rgba(15, 118, 110, 0.08)',
        'card': '0 4px 16px rgba(15, 118, 110, 0.1)',
        'elevated': '0 8px 32px rgba(15, 118, 110, 0.14)',
      },
    },
  },
  plugins: [],
};

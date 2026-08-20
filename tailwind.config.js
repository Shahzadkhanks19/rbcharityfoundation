/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rb: {
          50: '#f0f8f5',
          100: '#dceee6',
          500: '#1f7a5b',
          600: '#17644a',
          700: '#124f3b',
          800: '#0d3b2e',
          900: '#08281f'
        },
        gold: '#d9a441'
      },
      boxShadow: {
        soft: '0 20px 60px rgba(8,40,31,.12)'
      }
    }
  },
  plugins: []
}

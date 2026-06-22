/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        army: { DEFAULT: '#4a6741', dark: '#2d3e2a', light: '#6b8f61', accent: '#c5a028' },
        navy: { DEFAULT: '#003087', dark: '#001f5c', light: '#2255a4', accent: '#c5a028' },
        raf: { DEFAULT: '#003591', dark: '#00205c', light: '#1a4db3', accent: '#009cde' },
        pega: { DEFAULT: '#006dcc', dark: '#004a8f', light: '#3399ff', accent: '#00c2ff' },
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F0F10',
        surface: '#1B1B1D',
        border1: '#2A2A2D',
        border2: '#3A3A3D',
        light: '#E8E6DF',
        divider: '#CFCCC4',
        ink: '#111111',
        mutedlight: '#555555',
        lime: '#C9D98A',
        violet: '#5B3FF0',
        yellow: '#FDC55E',
        coral: '#EB5A52',
        plum: '#523E80',
      },
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        card: '32px',
        tile: '28px',
        btn: '24px',
        chip: '20px',
        pill: '14px',
      },
      fontSize: {
        // keep defaults
      },
    },
  },
  plugins: [],
}

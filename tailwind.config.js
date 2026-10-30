/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#121212',
        surface: '#E8E6E1',
        surface2: '#FFFFFF',
        border: '#CFCCC4',
        borderSoft: '#E0DDD3',
        ink: '#111111',
        muted: '#555555',
        lime: '#C9DB8A',
        limeDark: '#B4C86E',
        purple: '#5B45F0',
        purpleDark: '#4F3F7F',
        yellow: '#FBC85F',
        coral: '#EE5A55',
        coralDark: '#C94844',
        shadowPurple: 'rgba(91, 69, 240, 0.35)',
      },
      fontFamily: {
        display: ['Unbounded', 'Manrope', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        card: '32px',
        tile: '28px',
        btn: '26px',
        chip: '22px',
        round: '9999px',
      },
      fontSize: {
        kicker: ['12px', { lineHeight: '1.2', letterSpacing: '0.14em', fontWeight: '700' }],
        tile: ['15px', { lineHeight: '1.2', fontWeight: '800', fontFamily: "'Unbounded', Manrope, sans-serif" }],
        cardTitle: ['25px', { lineHeight: '1.15', fontWeight: '800', fontFamily: "'Unbounded', Manrope, sans-serif" }],
        heading: ['28px', { lineHeight: '1.15', fontWeight: '800', fontFamily: "'Unbounded', Manrope, sans-serif" }],
        body: ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        bodyLg: ['15px', { lineHeight: '1.6', fontWeight: '500' }],
        small: ['12px', { lineHeight: '1.4', fontWeight: '500' }],
        tiny: ['11px', { lineHeight: '1.4', fontWeight: '700' }],
      },
      spacing: {
        screen: '20px',
        gap: '12px',
      },
      boxShadow: {
        press: 'inset 3px 3px 6px rgba(0,0,0,0.4)',
        selected: 'inset -5px -5px 10px rgba(0,0,0,0.7)',
        outer: '0 10px 30px rgba(91, 69, 240, 0.35)',
        outerLime: '0 10px 30px rgba(201, 219, 138, 0.25)',
        outerYellow: '0 10px 30px rgba(251, 200, 95, 0.25)',
        outerCoral: '0 10px 30px rgba(238, 90, 85, 0.25)',
      },
      transition: {
        spring: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}

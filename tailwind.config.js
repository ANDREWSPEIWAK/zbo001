/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Brand palette — vibrant, high-contrast, no same-on-same */
        bg: '#0F0F10',            /* deep near-black background */
        surface: '#1A1A1C',       /* dark surface, slightly lighter than bg */
        surface2: '#2A2A2D',      /* elevated dark surface */
        border: '#3A3A3D',        /* subtle border */
        borderSoft: '#4A4A4D',    /* softer border */
        ink: '#FFFFFF',           /* primary text on dark */
        muted: '#A9A9AE',         /* secondary text */
        lime: '#C9DB8A',          /* light green (only on dark bg) */
        limeDark: '#8FA55E',      /* darker lime for text on lime */
        purple: '#8B5CF6',        /* vibrant brand purple */
        purpleDark: '#6D28D9',    /* deeper purple */
        purpleBg: '#2E1A47',      /* dark purple panel bg (not same as purple text) */
        yellow: '#FBBF24',        /* warm yellow/gold */
        yellowDark: '#B45309',    /* dark gold for text on yellow */
        coral: '#F87171',         /* vibrant coral/red */
        coralDark: '#B91C1C',     /* dark red for text on coral */
        shadowPurple: 'rgba(139, 92, 246, 0.45)',
        shadowLime: 'rgba(201, 219, 138, 0.3)',
        shadowYellow: 'rgba(251, 191, 36, 0.3)',
        shadowCoral: 'rgba(248, 113, 113, 0.35)',
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
        press: 'inset 3px 3px 6px rgba(0,0,0,0.5)',
        selected: 'inset -5px -5px 10px rgba(0,0,0,0.8)',
        outer: '0 20px 40px rgba(139, 92, 246, 0.35)',
        outerLime: '0 20px 40px rgba(201, 219, 138, 0.3)',
        outerYellow: '0 20px 40px rgba(251, 191, 36, 0.3)',
        outerCoral: '0 20px 40px rgba(248, 113, 113, 0.35)',
        card: '0 12px 32px rgba(0,0,0,0.5)',
      },
      transition: {
        spring: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

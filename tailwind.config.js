/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf2f4',
          100: '#fce7ea',
          200: '#f9d0d9',
          300: '#f4a9b8',
          400: '#ec7a93',
          500: '#df4d6f',
          600: '#c9305a',
          700: '#a9234a',
          800: '#8d2042',
          900: '#791f3d',
          950: '#440c1e',
        },
        cream: {
          50: '#fefdfb',
          100: '#fdf9f3',
          200: '#faf3e6',
          300: '#f5e8d3',
          400: '#edd5b3',
        },
        oak: {
	  200: '#d6c3a3', // example value
          300: '#c9b18f',
	  400: '#b89d78',
          500: '#a28763',
	  600: '#6b5344',
          700: '#574537',
          800: '#47392d',
          900: '#3a2f26',
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canopy: '#4BAF6F',        // vibrant jungle green
        moss: '#6EC3B0',          // soft mint green
        sandstone: '#EFE0C8',     // light tan backdrop
        blossom: '#F8AFA6',       // warm pastel coral
        sunlit: '#FFE599',        // gentle pastel yellow
        slate: '#1F2D1D',         // dark olive for text
        ivory: '#FBF8F1',         // off-white
      },
      fontFamily: {
        body: ['Poppins', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(8px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        bounce: {
          '0%,100%': { transform: 'translateY(-10%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.4s ease-out forwards',
        'bounce': 'bounce 1.2s infinite',
      },
      borderRadius: {
        lg: '14px',
        xl: '24px',
      },
      boxShadow: {
        soft: '0 6px 16px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
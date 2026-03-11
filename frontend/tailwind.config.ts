import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: { '2xs': ['0.65rem', '1rem'] },
      screens: { xs: '480px' },
      zIndex: { 60: '60', 70: '70', 80: '80' },
      zIndex: { 60: '60', 70: '70', 80: '80' },
      screens: { xs: '480px' },
      zIndex: { 60: '60', 70: '70', 80: '80' },
      fontSize: { '2xs': ['0.65rem', '1rem'] },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: '#60a5fa',
          purple: '#a78bfa',
          indigo: '#818cf8',
        },
      },
      opacity: { 15: '0.15', 35: '0.35', 85: '0.85' },
      opacity: { 15: '0.15', 35: '0.35', 85: '0.85' },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-sm': 'bounceSm 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(147, 197, 253, 0.4)' },
          '100%': { boxShadow: '0 0 40px rgba(167, 139, 250, 0.6)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSm: {
          '0%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-6px)' },
          '60%': { transform: 'translateY(-3px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans SC', 'sans-serif'],
      },
      colors: {
        // 糖果色系主色调
        candy: {
          pink: '#FF6B9D',
          purple: '#C084FC',
          blue: '#60A5FA',
          green: '#4ADE80',
          yellow: '#FBBF24',
          orange: '#FB923C',
          red: '#F87171',
        },
        // 柔和背景色
        soft: {
          pink: '#FCE7F3',
          purple: '#F3E8FF',
          blue: '#DBEAFE',
          green: '#DCFCE7',
          yellow: '#FEF3C7',
          orange: '#FFEDD5',
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}

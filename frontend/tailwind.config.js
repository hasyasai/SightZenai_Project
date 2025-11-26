
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00fff7',
          magenta: '#ff00e6',
          purple: '#b700ff',
          lime: '#c8ff00'
        },
        midnight: '#05010a',
        card: 'rgba(255,255,255,0.08)'
      },
      boxShadow: {
        neon: '0 0 8px #00fff7, 0 0 12px #ff00e6',
      }
    }
  },
  plugins: [],
}

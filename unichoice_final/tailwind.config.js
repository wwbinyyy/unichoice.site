export default {
  darkMode: ['class'],
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3',900:'#312e81'},
        accent:{50:'#ecfeff',100:'#cffafe',200:'#a5f3fc',300:'#67e8f9',400:'#22d3ee',500:'#06b6d4'}
      },
      boxShadow: { soft:'0 8px 30px rgba(0,0,0,.06)' },
      borderRadius: { '2xl':'1.25rem' }
    }
  },
  plugins: []
}

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      russo: [ "RussoOne" ],
      sans: ['Helvetica', 'Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        orange:'#ec6a01',
        bg0:'#061428',
        bg1:'#08153c',
        bg2:'#17254e',
        bg3:'#6366f1',
        bg4:'#6f63aa',
        bg5:'#2e8a7f',
        bg6:'#08153c',
        bg7:'#101c43',
        bg8:'#231a1e',
        bg9:'#3e290e',
        bg10:'#0e223e',
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow')
  ],
}
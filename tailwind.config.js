/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#000',
        inputColor: '#333533',
        darkBody: '#1f2224',
        darkGray: '#212529',
        smothDark: '#141516',
        darkRed: '#e03131',
        lightRed: '#ff6b6b',
        iconRed: '#f03e3e',
        success: '#37b24d',
        facebook: '#3c5484',
        lighterFacebook: '#7d97cd',
        twitter: '#00acee',
        youtube: '#fd1d1d',
        lightBlue: '#1DA1F2',
        lighertBlue: '#74c0fc'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
}

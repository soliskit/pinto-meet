module.exports = {
  purge: ['./pages/**/*.tsx', './types/*.{ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: [
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Fira Sans',
        'Droid Sans',
        '-apple-system',
        'sans-serif'
      ]
    },
    screens: {
      xs: '414px', // X🅁
      sm: '568px', // SE I landscape
      md: '768px', // 10"
      lg: '1024px', // 13"
      xl: '1366px', // 13" landscape
      xxl: '1920px' // Apple TV
    },
    extend: {
      backgroundImage: () => ({
        'hero-image': "url('/hero_image.jpg')"
      }),
      colors: {
        control: '#f5f5f557'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}

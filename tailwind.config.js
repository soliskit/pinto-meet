module.exports = {
  purge: ['./pages/**/*.tsx', './types/*.{ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', '-apple-system', 'sans-serif']
    },
    screens: {
      /* eslint-disable quote-props */
      // iPhone SE portrait
      'sm': '320px',
      // iPhone 8+ landscape
      'md': '736px',
      // iPad mini landscape & iPad Pro 12.9 portait
      'lg': '1024px',
      // iPad Pro 12.9 landscape
      'xl': '1366px',
      // Desktop
      '2xl': '1552px'
    },
    extend: {
      backgroundImage: theme => ({
        'hero-image': "url('/hero_image.jpg')"
      }),
      colors: {
        'control': '#f5f5f557'
      }
      /* eslint-enable quote-props */
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
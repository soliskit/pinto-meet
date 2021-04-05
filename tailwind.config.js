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
        control:  {
          light: '#f5f5f557',
          DEFAULT: '#f5f5f557',
          dark: '#f5f5f557'
        },
        default:  {
          light: '#72246C',
          DEFAULT: '#72246C',
          dark: '#72246C'
        },
        room:  {
          light: '#72246C',
          DEFAULT: '#151515',
          dark: '#72246C'
        },
        video:  {
          start: '#301b3f',
          DEFAULT: '#290149',
          end: '#282846'
        },
        'btn-primary':  {
          light: '#f5f5f557',
          DEFAULT: '#301B3F',
          dark: '#f5f5f557'
        },
        'btn-secondary':  {
          light: '#f5f5f557',
          DEFAULT: '#301B3F',
          dark: '#f5f5f557'
        },
        'btn-tertiary':  {
          light: '#f5f5f557',
          DEFAULT: '#301B3F',
          dark: '#f5f5f557'
        },
        'btn-danger':  {
          light: '#f5f5f557',
          DEFAULT: '#301B3F',
          dark: '#f5f5f557'
        },
        'input-name':  {
          light: '#f5f5f557',
          DEFAULT: '#301B3F',
          dark: '#f5f5f557'
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}

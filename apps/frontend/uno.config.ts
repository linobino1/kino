import {
  defineConfig,
  presetIcons,
  presetUno,
  presetWind,
  transformerDirectives,
  presetTypography,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetWind(),
    presetIcons(),
    presetTypography({
      cssExtend: {
        p: {
          'line-height': '1.4',
        },
      },
    }),
  ],
  transformers: [transformerDirectives()],
  theme: {
    breakpoints: {
      xs: '450px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    fontFamily: {
      sans: 'var(--font-dm-sans), Helvetica, Arial, sans-serif',
      calendar: 'Tahoma, Geneva, sans-serif',
    },
    fontSize: {
      //--font-xxx-big: normal 300 2.5rem/1 var(--font-family);
      // --font-xx-big: normal 300 1.9rem/1 var(--font-family);
      // --font-x-big: normal 300 1.7rem/1.2 var(--font-family);
      // --font-big: normal 300 1.3rem/1.2 var(--font-family);
      // --font: normal 300 1rem/1.4 var(--font-family);
      // --font-small: normal 300 0.9rem/1.4 var(--font-family);
      // --font-x-small: normal 300 0.8rem/1.4 var(--font-family);
      // --font-h2: var(--font-weight-bold) 1.9rem/1 var(--font-family)
      //
      // mobile:
      // --font-xxx-big: normal 300 1.9rem/1 var(--font-family);
      // --font-xx-big: normal 300 1.7rem/1 var(--font-family);
      // --font-x-big: normal 300 1.3rem/1.2 var(--font-family);
      // --font-big: normal 300 1.15rem/1.2 var(--font-family);
      xs: ['0.8rem', '1.2'], // x-small
      sm: ['0.9rem', '1.2'], // small
      base: ['1rem', '1.2'], // base
      lg: ['clamp(1.15rem, (100vw - 640px) * 99, 1.3rem)', '1.2'], // big
      xl: ['clamp(1.3rem, (100vw - 640px) * 99, 1.5rem)', '1.2'], // x-big
      '2xl': ['clamp(1.5rem, (100vw - 640px) * 99, 1.7rem)', '1'], // xx-big
      '3xl': ['clamp(1.7rem, (100vw - 640px) * 99, 1.9rem)', '1'], // xxx-big
      '4xl': ['clamp(1.9rem, (100vw - 640px) * 99, 2.5rem)', '1'], // xxx-big
    },
    colors: {
      theme: {
        50: '#E3E6F7',
        100: '#CCD1F0',
        200: '#99A2E1',
        300: '#6674D2',
        400: '#3748B9',
        500: '#283587',
        600: '#1F296A',
        700: '#182053',
        800: '#101537',
        900: '#080B1C',
        950: '#03050C',
      },
      yellow: {
        50: '#FFFBE6',
        100: '#FEF6CD',
        200: '#FEED9A',
        300: '#FDE363',
        400: '#FCDA30',
        500: '#F6CD03',
        600: '#C5A402',
        700: '#927A02',
        800: '#655401',
        900: '#322A01',
        950: '#191500',
      },
      red: {
        50: '#FDEBE7',
        100: '#FBD3CB',
        200: '#F6A797',
        300: '#F27B64',
        400: '#EE5030',
        500: '#D63312',
        600: '#A9280E',
        700: '#7F1E0B',
        800: '#551407',
        900: '#2A0A04',
        950: '#180602',
      },
      neutral: {
        50: '#F0F0F0',
        100: '#E0E0E0',
        200: '#C4C4C4',
        300: '#A6A6A6',
        400: '#8A8A8A',
        500: '#6B6B6B',
        600: '#575757',
        700: '#404040',
        800: '#2B2B2B',
        900: '#141414',
        950: '#0A0A0A',
      },
    },
  },
})

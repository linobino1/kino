import { defineConfig, presetWebFonts, presetIcons, presetUno, presetWind } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetWind(),
    presetIcons(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: {
          name: 'DM Sans',
          weights: [100, 200, 300, 400, 500, 600, 700],
        },
      },
    }),
  ],
  theme: {
    colors: {
      yello: {
        50: '#FFFAE6',
        100: '#FFF6D1',
        200: '#FFEB9E',
        300: '#FEE271',
        400: '#FED83E',
        500: '#FECF0F',
        600: '#D5AB01',
        700: '#A38201',
        800: '#6B5500',
        900: '#382D00',
        950: '#191400',
      },
      blu: {
        50: '#E2F1FE',
        100: '#C9E5FD',
        200: '#8FC8FA',
        300: '#59AEF8',
        400: '#1E91F5',
        500: '#0974D1',
        600: '#075CA6',
        700: '#06467F',
        800: '#042E53',
        900: '#02182C',
        950: '#010B14',
      },
    },
  },
})

import { DocGenerator } from '../types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const landing: DocGenerator<'pages'> = ({ context: { media, pages }, locale }) => ({
  title: 'Home',
  slug: 'home',
  layoutType: 'default',

  hero: {
    type: 'image',
    headline: 'Kino im Blauen Salon',

    image: media.get('hero.avif')?.id,
  },

  blocks: [],

  meta: {
    title: 'Kino im Blauen Salon',
    description:
      'Here you can find all the news about the Blauer Salon, the cinema, the HfG or whatever the editors think is worth sharing.',

    image: media.get('hero.avif')?.id,
  },
})

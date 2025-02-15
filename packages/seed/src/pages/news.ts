import type { DocGenerator } from '../types'
import { translate } from '../util/translate'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const news: DocGenerator<'pages'> = ({ context: { media, pages }, locale }) => ({
  title: translate(
    {
      de: 'Aktuelles',
      en: 'News',
    },
    locale,
  ),
  slug: 'news',
  layoutType: 'default',

  hero: {
    type: 'headline',
    headline: translate(
      {
        de: 'Aktuelles',
        en: 'News',
      },
      locale,
    ),
  },

  blocks: [],

  meta: {
    title: translate(
      {
        de: 'Aktuelles',
        en: 'News',
      },
      locale,
    ),
    description:
      'Here you can find all the news about the Blauer Salon, the cinema, the HfG or whatever the editors think is worth sharing.',

    image: media.get('hero.avif')?.id,
  },
})

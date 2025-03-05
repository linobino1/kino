import type { DocGenerator } from '../types'
import { translate } from '../util/translate'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const seasons: DocGenerator<'pages'> = ({ context: { media, pages }, locale }) => ({
  title: translate(
    {
      de: 'Spielzeiten',
      en: 'Seasons',
    },
    locale,
  ),
  slug: 'seasons',
  layoutType: 'default',

  hero: {
    type: 'image',
    headline: 'Kino im Blauen Salon',

    image: media.get('hero.avif')?.id,
  },

  blocks: [],
})

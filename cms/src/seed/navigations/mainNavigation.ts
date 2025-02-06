import { RequiredDataFromCollectionSlug } from 'payload'
import { DocGenerator } from '../types'
import { translate } from '../util/translate'

export const mainNavigations: DocGenerator<'navigations'> = ({ context: { pages }, locale }) =>
  ({
    type: 'main',

    items: [
      {
        type: 'internal',
        name: translate({ de: 'Aktuell', en: 'News' }, locale),
        newTab: false,
        page: pages.get('Home')?.id,
        id: '67a51314c2678dd65b58ff24',
      },
      {
        type: 'internal',
        name: translate({ de: 'Vorstellungen', en: 'Screenings' }, locale),
        newTab: false,
        page: pages.get('Screenings')?.id,
        id: '67a51314c2678dd65b58ff25',
      },
    ],
  }) as RequiredDataFromCollectionSlug<'navigations'>

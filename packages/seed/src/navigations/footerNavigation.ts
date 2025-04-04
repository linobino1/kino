import type { RequiredDataFromCollectionSlug } from 'payload'
import type { DocGenerator } from '../types'
import { translate } from '../util/translate'

export const footerNavigation: DocGenerator<'navigations'> = ({ context: { pages }, locale }) =>
  ({
    type: 'footer',

    items: [
      {
        type: 'internal',
        name: translate({ de: 'Aktuell', en: 'News' }, locale),
        newTab: false,
        page: pages.get('News')?.id,
        id: '67a51314c2678dd65b58ff24',
      },
      {
        type: 'internal',
        name: translate({ de: 'Vorstellungen', en: 'Screenings' }, locale),
        newTab: false,
        page: pages.get('Screenings')?.id,
        id: '67a51314c2678dd65b58ff25',
      },
      {
        type: 'internal',
        name: translate({ de: 'Spielzeiten', en: 'Seasons' }, locale),
        newTab: false,
        page: pages.get('Seasons')?.id,
        id: '67a51314c2678dd65b58ff15',
      },
      {
        type: 'internal',
        name: translate({ de: 'Open Air Kino', en: 'Open Air Cinema' }, locale),
        newTab: false,
        page: pages.get('Open Air Cinema')?.id,
        id: '67a51314c2678dd65b58ff26',
      },
      {
        type: 'internal',
        name: translate({ de: 'Buchungen', en: 'Bookings' }, locale),
        newTab: false,
        page: pages.get('Bookings')?.id,
        id: '67a51314c2678dd65b58ff27',
      },
    ],
  }) as RequiredDataFromCollectionSlug<'navigations'>

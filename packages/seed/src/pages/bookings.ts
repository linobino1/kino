import { translate } from '@app/i18n'
import type { DocGenerator } from '../types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const bookingsPage: DocGenerator<'pages'> = ({ context: { media, pages }, locale }) => ({
  title: translate({ de: 'Buchungen', en: 'Bookings' }, locale),

  layoutType: 'info',

  hero: {
    type: 'headline',
    headline: 'Buchungen',
  },

  meta: {},

  blocks: [
    {
      content: {
        root: {
          type: 'root',

          children: [
            {
              type: 'paragraph',

              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Hier siehst du die Belegung des Blauen Salons für die nächsten vier Wochen. Falls du den Salon buchen möchtest, schreib uns einfach, wir klären die Belegung und tragen dich ein und können gegebenenfalls eine Einführung in die Technik o.ä. geben oder bei der Betreuung der Veranstaltung helfen.',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              textStyle: '',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      id: '66f64920618a85015f18752f',
      blockType: 'content',
    },

    {
      url: 'https://webmail.hfg-karlsruhe.de/services/ajax.php/kronolith/embed?token=bGumTYVcPSXJCOnQq5ddVk1&calendar=internal_hwwfPnACHMVRk4ZwVVQ4V--&view=Monthlist&container=kronolithCal',
      id: '671f661a7987500003ab8d27',
      blockType: 'kronolithCalendarEmbed',
    },
  ],
})

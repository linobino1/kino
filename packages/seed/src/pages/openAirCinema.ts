import { translate } from '@app/i18n'
import type { DocGenerator } from '../types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const openAirCinemaPage: DocGenerator<'pages'> = ({
  context: { media, events },
  locale,
}) => ({
  title: translate({ de: 'Open Air Kino', en: 'Open Air Cinema' }, locale),
  layoutType: 'info',

  hero: {
    type: 'headline',
    headline: 'Open Air Kino',
  },

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
                  text: 'Nun bereits seit 2019 veranstaltet das Team vom Kino im Blauen Salon ein Open Air Kino. Auf der Wiese vor der HfG gibt es eine Woche lang tolle Filme mit lustigem Vorprogramm, Drinks, unterhaltsamer Moderation, Filmrätsel, usw. Gewohnte HfG-Qualität. Die Wiese ist bereit für eure Picknick-Decken, Liegestühle, Sofas – da dürft ihr kreativ werden. Bei Regen muss spontan reagiert werden – informiert euch einfach auf der Website über die aktuelle Lage.',
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
      id: '671d1de8c9a3ca139ca7e424',
      blockType: 'content',
    },

    {
      type: 'manual',

      events: Array.from(events).map(([, event]) => ({ doc: event.id })),
      id: '671d1de8c9a3ca139ca7e425',
      blockType: 'events',
    },

    {
      images: Array.from(media).map(([, media]) => ({
        image: media.id,
      })),
      id: '671d1de8c9a3ca139ca7e426',
      blockName: 'Where?!',
      blockType: 'gallery',
    },

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
                  text: 'Das OPEN AIR KINO VOR DER HFG befindet sich wie der Titel schon vermuten lässt vor der HfG, genauer gesagt auf der Wiese zwischen HfG/ZKM und Bundesanwaltschaft.',
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

            {
              type: 'paragraph',

              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: '',
                  version: 1,
                },

                {
                  type: 'link',

                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: '☞ Find it in Google Maps',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',

                  fields: {
                    doc: null,
                    linkType: 'custom',
                    newTab: false,
                    url: 'https://maps.app.goo.gl/CcRYE3RUJ7j4DaQ67',
                  },
                  format: '',
                  indent: 0,
                  version: 2,
                },

                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: '',
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

            {
              type: 'heading',

              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Anfahrt',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              tag: 'h2',
              version: 1,
            },

            {
              type: 'paragraph',

              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Öffentliche Verkehrsmittel:\nAb Hauptbahnhof mit der Straßenbahn der Linie 2 (Richtung Siemensallee über ZKM) bis Haltestelle „ZKM“ oder mit dem Bus der Linie 55 (Richtung Kühler Krug) bis Haltestelle „Lorenzstraße/ZKM“.',
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

            {
              type: 'paragraph',

              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: '',
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

            {
              type: 'paragraph',

              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'PKW:\nVon der Autobahn (A5), Ausfahrt Karlsruhe Mitte, über die Südtangente, Ausfahrt 4 ZKM, auf der Brauerstraße Richtung Innenstadt, an der zweiten Ampelkreuzung links in die Südendstraße, die erste Straße rechts ist die Lorenzstraße.',
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

            {
              type: 'paragraph',

              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: '',
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

            {
              type: 'paragraph',

              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Parkplätze:\nIm kostenpflichtigen Parkhaus stehen Ihnen etwa 700 Parkplätze zur Verfügung. Zu erreichen ist das Parkhaus »ZKM« über die Südendstraße 44. Für Elektroautos stehen zwei Stromladestationen zur Verfügung – während eine Station für Autos von »Stadtmobil« reserviert ist, kann die andere Station von allen Tiefgaragen-Parkern genutzt werden.',
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
      id: '671d1de8c9a3ca139ca7e427',
      blockName: 'There!',
      blockType: 'content',
    },

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
                  text: 'Der Eintritt zum Open Air Kino vor der HfG ist ',
                  version: 1,
                },

                {
                  type: 'text',
                  detail: 0,
                  format: 1,
                  mode: 'normal',
                  style: '',
                  text: 'frei',
                  version: 1,
                },

                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: '! Tickets gibt es also in diesem Sinne nicht. Zu reservieren ist nur der Sitz - beziehungsweise Liegeplatz, und hier gilt: Wer zuerst kommt, malt zuerst! Also seid rechtzeitig da! Es gibt genügend Sitzplätze und zudem auch genügend freie Wiesefläche, bringt hierfür gerne eure eigenen Decken, Campingstühle etc. mit!',
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
      id: '671d1de8c9a3ca139ca7e428',
      blockName: 'Tickets',
      blockType: 'content',
    },

    {
      images: Array.from(media)
        .reverse()
        .map(([, media]) => ({
          image: media.id,
        })),
      id: '671d1de8c9a3ca139ca7e429',
      blockName: 'Rahmenprogramm',
      blockType: 'gallery',
    },

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
                  text: 'Es spielt sich immer einiges ab auf der Wiese vor der HfG und zwar schon lange bevor der Film beginnt. Ab 20 Uhr gibt unser Bar und Food-Team alles, es gibt Drinks, Snacks, frisches vom Grill (alles auch in vegan), Popcorn, Nachos und vieles mehr! Außerdem führt unser cooles DJ-Team jeden Tag klanglich in die Filmwelt ein, eine Art auditives Warm-Up schon ab 20 Uhr! Und sobald die Dämmerung einsetzt gibt es experimentelle Kurzfilme zu sehen, die live auf der Wiese von unserem 16mm-Filmvorführer präsentiert werden, tagesaktuell und je nach Lust und Laune in Begleitung durch unser DJ-Team. ',
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
      id: '671d1de8c9a3ca139ca7e42a',
      blockName: 'Rahmenprogramm',
      blockType: 'content',
    },
  ],
})

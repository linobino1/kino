import type { DocGenerator } from '../types'
import { translate } from '../util/translate'

export const jazzClubPost: DocGenerator<'posts'> = ({ context, locale }) => {
  // posted 25 days ago
  const date = new Date()
  date.setDate(date.getDate() - 25)

  const currentYear = new Date().getFullYear()

  return {
    title: translate(
      {
        de: 'Rückblick: Jazz im Blauen Salon',
        en: 'Review: Jazz in the Blaue Salon',
      },
      locale,
    ),
    date: date.toISOString(),
    header: context.media.get('jazz.avif')?.id as string,
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
                text: translate(
                  {
                    de: 'Am vergangenen Freitag, den 24.05. spielten sich im Blauen Salon der Hochschule für Gestaltung unglaubliche Szenen ab. Naiv mal als Kinobetreiber einen musikalischen Abend initiiert, waren wir dann doch etwas überfordert mit dem Andrang an Publikum und spielbegeisterten Musiker*innen...',
                    en: 'Last Friday, May 24, incredible scenes unfolded in the Blaue Salon at the Karlsruhe University of Arts and Design. Naively initiating a musical evening as student cinema operators, we were somewhat overwhelmed by the rush of audience and enthusiastic musicians...',
                  },
                  locale,
                ),
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

    details: [
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
                    text: 'Unsere neue Reihe: ',
                    version: 1,
                  },

                  {
                    type: 'text',
                    detail: 0,
                    format: 1,
                    mode: 'normal',
                    style: '',
                    text: 'Kino der Farben,',
                    version: 1,
                  },

                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: ' in der wir uns mit zehn Filmen dem faszinierenden Phänomen der Farbe im Kino widmen: wie kommt sie zustande, wie wirkt sie, was erzählt sie…? Schließlich gibt es neben der Zeit wohl nichts essenzielleres als Licht und Farbe, die unser Leben und unsere Projektoren füttern. Während Schwarz-Weiß jahrzehntelang das frühe Kino prägte, läutete die Einführung von Technicolor in den 30ern eine neue Ära für unsere Sehgewohnheiten ein: Farbe haftet sich als Emotion tief in unserer Erinnerung fest. Wer könnte den Mantel des Mädchens in SCHINDLERS LISTE vergessen? Warum erkennt man einen Wes Anderson-Filme sofort am Aussehen, und welche Farbe hat noch mal die MATRIX?',
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
                    text: 'Über das gesamte Wintersemester spannt sich unser Programm wie ein Regenbogen und zeigt, dass der Blaue Salon sich nicht auf seinem monochromen Ruf ausruht. Im Gegenteil, das Kino wächst und gedeiht, und zur Feier führen wir dieses Semester zusätzlich zwei neue Reihen ein, auf die wir noch öfter zurückkommen werden: das ',
                    version: 1,
                  },

                  {
                    type: 'text',
                    detail: 0,
                    format: 1,
                    mode: 'normal',
                    style: '',
                    text: 'Double Feature',
                    version: 1,
                  },

                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: ' und die ',
                    version: 1,
                  },

                  {
                    type: 'text',
                    detail: 0,
                    format: 1,
                    mode: 'normal',
                    style: '',
                    text: 'Kult Sneak',
                    version: 1,
                  },

                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: '. Und dass das Pflicht-Event ',
                    version: 1,
                  },

                  {
                    type: 'text',
                    detail: 0,
                    format: 1,
                    mode: 'normal',
                    style: '',
                    text: 'Jazz im Blauen Salon',
                    version: 1,
                  },

                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: ' nicht fehlen darf, ist klar.',
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
                    text: 'Ihr seht, wir haben keine Mühen gescheut, um euch eine farbenfrohe Palette aus Klassikern und Raritäten der internationalen Filmlandschaft zusammenzustellen: 10 Filme verschiedenster Genres aus 10 verschiedenen Produktionsländern und 10 Jahrzehnten werden euch die graue Jahreszeit aus den Augen und Herzen verscheuchen!',
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
                        text: 'Hier gehts zum Programm',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',

                    fields: {
                      doc: {
                        relationTo: 'seasons',

                        value: context.seasons.get(`Winter term ${currentYear}`)?.id as string,
                      },
                      linkType: 'internal',
                      newTab: false,
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
                        text: 'Flyer Download als PDF',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',

                    fields: {
                      doc: {
                        relationTo: 'media',

                        value: context.media.get('dummy.pdf')?.id as string,
                      },
                      linkType: 'internal',
                      newTab: true,
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
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        id: '66e0a61b3f90fd015ec3ac55',
        blockType: 'content',
      },
    ],

    link: {
      type: 'none',
    },
  }
}

import type { DocGenerator } from '../types'
import { translate } from '../util/translate'

export const cinemaOfColors: DocGenerator<'screeningSeries'> = ({
  locale,
  context: { media },
}) => ({
  name: translate({ en: 'Cinema of Colors', de: 'Kino der Farben' }, locale),
  hero: {
    type: 'image',
    headline: translate({ en: 'Cinema of Colors', de: 'Kino der Farben' }, locale),
    image: media.get('hero.avif')?.id,
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
                  text: translate(
                    {
                      en: "Welcome to our new series CINEMA OF COLOR, in which we dedicate ten films to the fascinating phenomenon of color in cinema: how does it come about, how does it work, what does it tell us...? After all, apart from time, there is probably nothing more essential than light and color, which feed our lives and our projectors. While black and white dominated early cinema for decades, the introduction of Technicolor in the 1930s ushered in a new era for our viewing habits: Color sticks deep in our memory as an emotion. Who could forget the girl's coat in SCHINDLER'S LIST? Why can you immediately recognize a Wes Anderson film by its look, and what color is the MATRIX again?",
                      de: 'Willkommen zu unserer neuen Reihe KINO DER FARBEN, in der wir uns mit zehn Filmen dem faszinierenden Phänomen der Farbe im Kino widmen: wie kommt sie zustande, wie wirkt sie, was erzählt sie…? Schließlich gibt es neben der Zeit wohl nichts Essenzielleres als Licht und Farbe, die unser Leben und unsere Projektoren füttern. Während Schwarz-Weiß jahrzehntelang das frühe Kino prägte, läutete die Einführung von Technicolor in den 30ern eine neue Ära für unsere Sehgewohnheiten ein: Farbe haftet sich als Emotion tief in unserer Erinnerung fest. Wer könnte den Mantel des Mädchens in SCHINDLERS LISTE vergessen? Warum erkennt man einen Wes Anderson-Filme sofort am Aussehen, und welche Farbe hat noch mal die MATRIX?',
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
                      en: 'Our program spans the entire winter semester like a rainbow and shows that the Blue Salon is not resting on its monochrome reputation. Come along and immerse yourself in a colorful palette of classics and rarities from the international cinema landscape: 10 films of various genres from 10 different production countries and 10 decades will chase the grey season away from your eyes and hearts!',
                      de: 'Über das gesamte Wintersemester spannt sich unser Programm wie ein Regenbogen und zeigt, dass der Blaue Salon sich nicht auf seinem monochromen Ruf ausruht. Kommt vorbei und taucht ein in eine farbenfrohe Palette aus Klassikern und Raritäten der internationalen Kinolandschaft: 10 Filme verschiedenster Genres aus 10 verschiedenen Produktionsländern und 10 Jahrzehnten werden euch die graue Jahreszeit aus den Augen und Herzen verscheuchen!',
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
      id: '66b29a0af4547401853035e0',
      blockType: 'content',
    },
  ],
})

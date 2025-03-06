import { getCurrentSeasonName } from 'src/seasons'
import type { DocGenerator } from '../types'

export const pressReleaseCurrentSeason: DocGenerator<'pressReleases'> = ({ context }) => {
  const season = context.seasons.get(getCurrentSeasonName())?.id as string

  return {
    season,
    date: new Date().toISOString(),
    locale: 'de',
    title: 'Die aktuelle Saison',
    coverText: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Das ',
                type: 'text',
                version: 1,
              },

              {
                detail: 0,
                format: 1,
                mode: 'normal',
                style: '',
                text: 'Kino im Blauen Salon',
                type: 'text',
                version: 1,
              },

              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ', das studentische Kino der Hochschule für Gestaltung, wird seit 2017 von Studierenden betrieben und ist seit Anfang 2024 ein eingetragener Verein.',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },

          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'In diesem Semester laden wir ein zu unserer neuen Reihe ',
                type: 'text',
                version: 1,
              },

              {
                detail: 0,
                format: 1,
                mode: 'normal',
                style: '',
                text: '„Kino der Farben“',
                type: 'text',
                version: 1,
              },

              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ', in der wir uns mit zehn Filmen dem faszinierenden Phänomen der Farbe im Kino widmen: Wie kommt sie zustande, wie wirkt sie, was erzählt sie…? Schließlich gibt es neben der Zeit wohl nichts Essenzielleres als Licht und Farbe, die unser Leben und unsere Projektoren füttern. Während Schwarz-Weiß jahrzehntelang das frühe Kino prägte, läutete die Einführung von Technicolor in den 30ern eine neue Ära für unsere Sehgewohnheiten ein: Farbe haftet sich als Emotion tief in unserer Erinnerung fest. Wer könnte den Mantel des Mädchens in ',
                type: 'text',
                version: 1,
              },

              {
                detail: 0,
                format: 2,
                mode: 'normal',
                style: '',
                text: 'SCHINDLERS LISTE',
                type: 'text',
                version: 1,
              },

              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ' vergessen? Warum erkennt man einen Wes Anderson-Film sofort am Aussehen, und welche Farbe hat noch mal die ',
                type: 'text',
                version: 1,
              },

              {
                detail: 0,
                format: 2,
                mode: 'normal',
                style: '',
                text: 'MATRIX',
                type: 'text',
                version: 1,
              },

              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ' ?',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },

          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Über das gesamte Wintersemester spannt sich unser Programm wie ein Regenbogen und zeigt, dass der Blaue Salon sich nicht auf seinem monochromen Ruf ausruht. Im Gegenteil, der Verein wächst und gedeiht, und zur Feier führen wir dieses Semester zusätzlich zwei neue Reihen ein, auf die wir noch öfter zurückkommen werden: das DOUBLE-FEATURE und die KULT SNEAK. Und dass das Pflichtevent JAZZ IM BLAUEN SALON nicht fehlen darf, ist klar.',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },

          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Ihr seht, wir haben keine Mühen gescheut, um euch eine farbenfrohe Palette aus Klassikern und Raritäten der internationalen Filmlandschaft zusammenzustellen: 10 Filme verschiedenster Genres aus 10 verschiedenen Produktionsländern und 10 Jahrzehnten werden euch die graue Jahreszeit aus den Augen und Herzen verscheuchen!',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    },
  }
}

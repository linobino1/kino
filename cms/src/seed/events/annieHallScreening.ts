import { DocGenerator } from '../types'
import { translate } from '../util/translate'

export const annieHallScreening: DocGenerator<'events'> = ({ context, locale }) => {
  const currentYear = new Date().getFullYear()

  // event is in 59 days
  const date = new Date()
  date.setDate(date.getDate() + 59)

  return {
    _status: 'published',
    title: '',
    date: date.toISOString(),
    season: context.seasons.get(`Winter term ${currentYear}`)?.id as string,
    location: context.locations.get('Blauer Salon')?.id as string,
    programItems: [
      {
        type: 'screening',
        filmPrint: context.filmPrints.get('Casablanca')?.id as string,
        isMainProgram: false,
        info: {
          root: {
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: translate(
                      {
                        de: 'Heute zeigen wir im Vorprogramm vom Stadtneurotiker noch einen tollen Film aus Afrika, Casablanca.',
                        en: 'This is the additional info for this particular program item',
                      },
                      locale,
                    ),
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
                children: [],
                direction: null,
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
      },
      {
        type: 'screening',
        filmPrint: context.filmPrints.get('Annie Hall')?.id as string,
        isMainProgram: true,
      },
    ],
    series: context.screeningSeries.get('Cinema of Colors')?.id as string,
    info: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: translate(
                  {
                    de: 'Kaum zu glauben, nach mehreren Trölf-zig Jahren heißt es tatsächlich Servus, Ludger! Ludger Pfanz, Mitarbeiter an der HfG seit dem 5. Jahr nach Gründung, freut sich auf den Ruhestand und zum Abschied schauen wir gemeinsam nochmal den Kurzfilm seiner Filmemacher-Laufbahn, der in gewisser Weise als initiales HfG-Projekt in die Geschichte einging, in der Hinsicht, dass viele Mitglieder der HfG, von Studierenden über den Hausmeister bis zum Sekretariat an der Produktion beteiligt war.',
                    en: "It's hard to believe that after several dozen years, it's actually goodbye, Ludger! Ludger Pfanz, a member of staff at the HfG since the 5th year after its foundation, is looking forward to retirement and as a farewell we will watch the short film of his filmmaking career together again, which in a way went down in history as the initial HfG project, in the sense that many members of the HfG, from students to the janitor to the secretariat, were involved in the production.",
                  },
                  locale,
                ),
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
            children: [],
            direction: null,
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

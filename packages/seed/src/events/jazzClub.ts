import type { DocGenerator } from '../types'
import { translate } from '../util/translate'

export const jazzClubEvent: DocGenerator<'events'> = ({ context, locale }) => {
  const currentYear = new Date().getFullYear()

  // event is in 78 days
  const date = new Date()
  date.setDate(date.getDate() + 78)

  return {
    _status: 'published',
    date: date.toISOString(),
    season: context.seasons.get(`Winter term ${currentYear}`)?.id as string,
    location: context.locations.get('Blauer Salon')?.id as string,
    header: context.media.get('hero.avif')?.id as string,
    title: translate({ en: 'Jazz in Blue Salon', de: 'Jazz im Blauen Salon' }, locale),
    programItems: [
      {
        type: 'other',
        isMainProgram: true,
        poster: context.media.get('jazz.avif')?.id as string,
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
                        en: 'Experience “Jazz im Blauen Salon”, the ever-popular series in the stylish and velvety ambience of our cinema hall, which is filled with lively jazz sounds under the usual passionate direction of Jason and Philip.',
                        de: 'Erleben Sie „Jazz im Blauen Salon“, die stets gut besuchte Reihe im stilvollen und samtigen Ambiente unseres Kinosaals, der unter der gewohnt leidenschaftlichen Leitung von Jason und Philip mit lebendigen Jazzklängen gefüllt ist.',
                      },
                      locale,
                    ),
                    type: 'text',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: 'start',
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
                    text: translate(
                      {
                        en: 'After the last few successfully over-subscribed evenings, we are delighted to be able to continue this series in the winter semester 2024 and once again indulge in the masterful performances of talented musicians. Look forward to a session that even Miles Davis and co. would have loved - or even better: guests from as far afield as Rastatt and Pforzheim! At our event, in addition to the obligatory glass of wine, you can expect jazz standards, spontaneous improvisations and rousing jam sessions ranging from funk to hip-hop to neo-soul. Whether amateur or professional, ukulele or triangle - the Open Stage is open to everyone!',
                        de: 'Nach den letzten, erfolgreich überbuchten Abenden freuen wir uns, diese Reihe im Wintersemester 2024 fortsetzen zu können und uns erneut den meisterhaften Darbietungen talentierter Musiker hinzugeben. Freuen Sie sich auf eine Session, die selbst Miles Davis und Co. geliebt hätten – oder besser noch: Gäste aus Rastatt und Pforzheim! Bei unserer Veranstaltung erwartet Sie neben dem obligatorischen Glas Wein Jazzstandards, spontane Improvisationen und mitreißende Jam-Sessions von Funk über Hip-Hop bis Neo-Soul',
                      },
                      locale,
                    ),
                    type: 'text',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: 'start',
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
    ],
  }
}

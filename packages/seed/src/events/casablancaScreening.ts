import { timezone } from '@app/util/config'
import type { DocGenerator } from '../types'

export const casablancaScreening: DocGenerator<'events'> = ({ context }) => {
  const currentYear = new Date().getFullYear()

  // event is in 55 days
  const date = new Date()
  date.setDate(date.getDate() + 55)

  return {
    _status: 'published',
    title: '',
    header: '',
    date: date.toISOString(),
    date_tz: timezone,
    season: context.seasons.get(`Winter term ${currentYear}`)?.id as string,
    location: context.locations.get('Blauer Salon')?.id as string,
    programItems: [
      {
        type: 'screening',
        filmPrint: context.filmPrints.get('Casablanca')?.id as string,
        isMainProgram: true,
      },
    ],
  }
}

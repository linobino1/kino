import type { Payload } from 'payload'
import { createFilmPrint } from './filmPrint'
import { createSeason } from './season'
import { createMedia } from './media'
import { lexicalContent } from '../util/lexicalContent'

export const createScreeningEvent = async ({ payload }: { payload: Payload }) => {
  const filmPrint = await createFilmPrint({ payload })
  const season = await createSeason({ payload })
  const media = await createMedia({ payload })

  return await payload.create({
    collection: 'events',
    data: {
      date: new Date().toISOString(),
      title: '',
      header: '',
      season: season.id,
      programItems: [
        {
          type: 'other',
          isMainProgram: false,
          info: lexicalContent,
          poster: media.id,
        },
        {
          type: 'screening',
          filmPrint: filmPrint.id,
          isMainProgram: true,
        },
      ],
    },
  })
}

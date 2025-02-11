import type { Payload } from 'payload'
import { createFilmPrint } from './filmPrint'
import { createSeason } from './season'
import { createMedia } from './media'
import { lexicalContent } from '../util/lexicalContent'

export const createScreeningEvent = async ({ payload }: { payload: Payload }) => {
  let filmPrint = await createFilmPrint({ payload })
  const season = await createSeason({ payload })
  const media = await createMedia({ payload })

  const doc = (
    await payload.find({
      collection: 'events',
      where: {
        id: { exists: true },
      },
    })
  ).docs[0]

  if (doc) return doc

  filmPrint = (
    await payload.find({
      collection: 'filmPrints',
      where: { id: { exists: true } },
    })
  ).docs[0]

  return await payload.create({
    collection: 'events',
    data: {
      date: new Date().toISOString(),
      title: '',
      season: season.id,
      header: media.id,
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

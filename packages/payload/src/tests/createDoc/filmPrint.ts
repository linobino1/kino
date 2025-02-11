import type { Payload } from 'payload'
import { createMovie } from './movie'
import { createFormat } from './format'
import { createLanguageVersion } from './languageVersion'

export const createFilmPrint = async ({ payload }: { payload: Payload }) => {
  const movie = await createMovie({ payload })
  const format = await createFormat({ payload })
  const languageVersion = await createLanguageVersion({ payload })

  let doc = (
    await payload.find({
      collection: 'filmPrints',
      where: {
        id: { exists: true },
      },
    })
  ).docs[0]

  if (!doc) {
    doc = await payload.create({
      collection: 'filmPrints',
      data: {
        movie: movie.id,
        isRented: true,
        format: format.id,
        languageVersion: languageVersion.id,
      },
    })
  }

  await payload.update({
    collection: 'filmPrints',
    id: doc.id,
    data: {
      movie: movie.id,
      _status: 'published',
    },
  })

  return doc
}

import type { Payload } from 'payload'
import { createMovie } from './movie'
import { createFormat } from './format'
import { createLanguageVersion } from './languageVersion'

export const createFilmPrint = async ({ payload }: { payload: Payload }) => {
  const movie = await createMovie({ payload })
  const format = await createFormat({ payload })
  const languageVersion = await createLanguageVersion({ payload })

  return await payload.create({
    collection: 'filmPrints',
    data: {
      _status: 'published',
      movie: movie.id,
      isRented: true,
      format: format.id,
      languageVersion: languageVersion.id,
    },
  })
}

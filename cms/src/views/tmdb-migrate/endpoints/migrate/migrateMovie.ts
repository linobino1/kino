import type { Payload } from 'payload'
import { MigratedMovie } from './types'
import { migrateMovieBase } from './migrateMovieBase'
import { migrateCredits } from './migrateCredits'
import { migrateReleaseDates } from './migrateReleaseDates'
import { migrateVideos } from './migrateVideos'
import { migrateKeywords } from './migrateKeywords'
import { migrateImages } from './migrateImages'

type Props = {
  payload: Payload
  tmdbId: number
  images: {
    poster?: string
    backdrop?: string
  }
  warnings: Error[]
}
export const migrateMovie = async ({
  payload,
  tmdbId,
  images,
  warnings,
}: Props): Promise<MigratedMovie> => {
  const movie = await migrateMovieBase(payload, tmdbId, warnings)
  const context = {
    payload,
    movie,
    warnings,
  }

  // migrate data from the various endpoints of themoviedb.org
  // any errors will be added to warnings
  try {
    await Promise.all([
      migrateCredits(context),
      migrateReleaseDates(context),
      migrateVideos(context),
      migrateKeywords(context),
      migrateImages(context, images),
    ])
  } catch (err) {
    if (err instanceof Error) {
      warnings.push(err)
    } else {
      throw err
    }
  }

  return movie
}

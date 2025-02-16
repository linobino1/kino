'use server'

import type { MigratedMovie } from '@app/themoviedb/types'
import { getPayloadClient } from '@app/payload/util/getPayloadClient'
import { migrateMovie } from '@app/themoviedb/migrateMovie'
import { isAuthenticatedRequest } from '@/util/isAuthenticatedRequest'

export const migrate = async ({
  tmdbId,
  images,
}: {
  tmdbId: number
  images: {
    backdrop?: string
    poster?: string
  }
}): Promise<
  | {
      success: true
      data: {
        movie: MigratedMovie
        warnings: string[]
      }
    }
  | {
      success: false
      message: string
    }
> => {
  if (!(await isAuthenticatedRequest())) {
    return {
      success: false,
      message: 'Unauthorized',
    }
  }

  const payload = await getPayloadClient()

  const warnings: Error[] = []
  let movie: MigratedMovie | undefined
  try {
    movie = await migrateMovie({ payload, tmdbId, images, warnings: [] })
  } catch (err) {
    console.error('Unable to create movie in tmdb migrate action:')
    console.error(err)
    return { success: false, message: `Unable to create movie (${err})` }
  }

  return {
    success: true,
    data: {
      movie,
      warnings: warnings.map((warning) => warning.message),
    },
  }
}

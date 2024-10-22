import { themoviedb } from '.'
import type {
  tmdbCredits,
  tmdbMovie,
  tmdbMovieID,
  tmdbVideos,
  tmdbReleaseDates,
  tmdbKeywords,
  tmdbImages,
} from './types'

type Endpoint = 'movie' | 'credits' | 'videos' | 'keywords' | 'releaseDates' | 'images'

const endpoints: Record<Endpoint, (id: tmdbMovieID) => string> = {
  movie: (id) => `/movie/${id}`,
  credits: (id) => `/movie/${id}/credits`,
  videos: (id) => `/movie/${id}/videos`,
  keywords: (id) => `/movie/${id}/keywords`,
  releaseDates: (id) => `/movie/${id}/release_dates`,
  images: (id) => `/movie/${id}/images`,
}

/**
 * get data from themoviedb.org for a movie
 */
export async function tmdbFetch(
  endpoint: 'movie',
  tmdbId: tmdbMovieID,
  language?: string,
): Promise<tmdbMovie>
export async function tmdbFetch(
  endpoint: 'credits',
  tmdbId: tmdbMovieID,
  language?: string,
): Promise<tmdbCredits>
export async function tmdbFetch(
  endpoint: 'videos',
  tmdbId: tmdbMovieID,
  language?: string,
): Promise<tmdbVideos>
export async function tmdbFetch(
  endpoint: 'keywords',
  tmdbId: tmdbMovieID,
  language?: string,
): Promise<tmdbKeywords>
export async function tmdbFetch(
  endpoint: 'releaseDates',
  tmdbId: tmdbMovieID,
  language?: string,
): Promise<tmdbReleaseDates>
export async function tmdbFetch(
  endpoint: 'images',
  tmdbId: tmdbMovieID,
  language?: string,
): Promise<tmdbImages>
export async function tmdbFetch(
  endpoint: Endpoint,
  tmdbId: tmdbMovieID,
  language?: string,
): Promise<any> {
  let data: any
  const path = endpoints[endpoint](tmdbId)
  try {
    const res = await themoviedb.get(path, {
      params: {
        language,
      },
    })
    data = JSON.parse(res?.data)
  } catch {
    throw new Error('Unable to get themoviedb response for movie')
  }
  if (!data || data.success === false) {
    throw new Error(`No data found for movie '${tmdbId}' at endpoint '${path}'`)
  }
  return data
}

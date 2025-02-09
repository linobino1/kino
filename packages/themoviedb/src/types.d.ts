import type { Movie } from '@app/types/payload'
import type { Payload } from 'payload'

export interface MigrationFunction {
  (context: {
    payload: Payload
    movie: Partial<Movie> & Pick<Movie, 'id' | 'tmdbId'>
    warnings: Error[]
  }): Promise<void>
}

export type MigratedMovie = Partial<Movie> & Pick<Movie, 'id' | 'tmdbId'>

export type tmdbMovie = {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  runtime: number
  adult: boolean
  genres: {
    id: number
    name: string
  }[]
  credits: {
    cast: {
      id: number
      name: string
      character: string
    }[]
    crew: {
      id: number
      name: string
      job: string
    }[]
  }
  production_countries: {
    iso_3166_1: string
    name: string
  }[]
  production_companies: tmdbCompany[]
}

export type tmdbMovieID = tmdbMovie['id']

export type tmdbImages = {
  backdrops: {
    aspect_ratio: number
    file_path: string
    height: number
    iso_639_1: string
    vote_average: number
    vote_count: number
    width: number
  }[]
  posters: {
    aspect_ratio: number
    file_path: string
    height: number
    iso_639_1: string
    vote_average: number
    vote_count: number
    width: number
  }[]
}
export type tmdbPerson = {
  id: number
  name: string
  job: string
  order: number
}
export type tmdbCompany = {
  name: string
}
export type tmdbCredits = {
  cast: tmdbPerson[]
  crew: tmdbPerson[]
}
export type tmdbRelease = {
  iso_3166_1: string
  release_dates: {
    certification: string
    iso_639_1: string
    note: string
    release_date: string
    type: number
  }[]
}
export type tmdbReleaseDates = {
  results: tmdbRelease[]
}
export type tmdbVideo = {
  iso_639_1: string
  iso_3166_1: string
  name: string
  key: string
  site: 'YouTube' | string
  size: number
  type: 'Trailer' | string
  official: boolean
  published_at: string
  id: string
}
export type tmdbVideos = {
  results: tmdbVideo[]
}

export type tmdbKeywords = {
  keywords: {
    id: number
    name: string
  }[]
}

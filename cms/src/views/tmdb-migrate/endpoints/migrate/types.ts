import { Movie } from '@/payload-types'
import { Payload } from 'payload'

export interface MigrationFunction {
  (context: {
    payload: Payload
    movie: Partial<Movie> & Pick<Movie, 'id' | 'tmdbId'>
    warnings: Error[]
  }): Promise<void>
}

export type MigratedMovie = Partial<Movie> & Pick<Movie, 'id' | 'tmdbId'>

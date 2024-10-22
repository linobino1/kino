import { Movie } from '@/payload-types'
import { tmdbFetch } from './tmdbFetch'
import { ageRatingAges } from '@/collections/Movies'

/**
 *
 * @param tmdbId id of the movie on themoviedb.org
 * @returns string | undefined age certification of the latest release in germany
 */
export async function fetchAgeRating(tmdbId: number): Promise<Movie['ageRating'] | undefined> {
  const data = await tmdbFetch('releaseDates', tmdbId)
  if (!data.results) {
    return undefined
  }

  // find release dates for germany
  const germany = data.results.find((country) => country.iso_3166_1 === 'DE')
  if (!germany) {
    return undefined
  }
  const { release_dates } = germany

  // filter out age ratings we do not use
  release_dates.filter((release_date) => {
    return ageRatingAges.map((x) => `${x}`).includes(release_date.certification)
  })

  // find the latest release
  release_dates.sort((a, b) => {
    const dateA = new Date(a.release_date)
    const dateB = new Date(b.release_date)
    return dateB.getTime() - dateA.getTime()
  })

  return (release_dates[0]?.['certification'] as Movie['ageRating']) || undefined
}

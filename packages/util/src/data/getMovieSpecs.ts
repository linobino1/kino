import type { Country, FilmPrint, Format, LanguageVersion, Movie, Person } from '@app/types/payload'
import type { TFunction } from 'i18next'

export type Props = {
  filmPrint: FilmPrint
  t: TFunction
  hideDCP?: boolean // only show format if it's not DCP
  hideGermanLanguageVersionForGermanMovies?: boolean // only show language if it's not a german movie with german language version
}
export type MovieSpecsItem =
  | 'title'
  | 'originalTitle'
  | 'directors'
  | 'countries'
  | 'year'
  | 'countriesAndYear'
  | 'duration'
  | 'format'
  | 'language'
  | 'languageShort'
  | 'cast'
type MovieSpecs = Record<MovieSpecsItem, string | undefined>

export const getMovieSpecs = ({
  filmPrint,
  t,
  hideDCP = false,
  hideGermanLanguageVersionForGermanMovies = false,
}: Props): MovieSpecs => {
  const movie = filmPrint.movie as Movie

  if (movie.directors.length && typeof movie.directors[0] === 'string') {
    throw new Error('movieSpecs expects more depth')
  }

  const countries = (movie.countries as Country[])?.map((x) => x.name).join(', ')
  const year = `${movie.year}`

  let format: string | undefined = filmPrint.format && (filmPrint.format as Format)?.name
  if (hideDCP && format === 'DCP') format = undefined

  let languageVersion: LanguageVersion | undefined = filmPrint.languageVersion as LanguageVersion
  if (
    hideGermanLanguageVersionForGermanMovies &&
    ['ov', 'of'].includes(languageVersion.abbreviation?.toLowerCase()) &&
    movie.countries.length === 1 &&
    (movie.countries[0] as Country).id?.toLowerCase() === 'de'
  ) {
    languageVersion = undefined
  }

  return {
    title: movie.title,
    originalTitle: movie.originalTitle,
    directors:
      movie.directors &&
      t('directed by {directors}', {
        directors: (movie.directors as Person[])?.map((x) => x.name).join(', '),
      }),
    countries,
    year,
    countriesAndYear: `${countries} ${year}`,
    duration: t('duration {duration}', { duration: movie.duration }),
    format,
    language: languageVersion?.name,
    languageShort: languageVersion?.abbreviation,
    cast: movie.cast?.length
      ? t('starring {actors}', {
          actors: (movie.cast as Person[])
            ?.slice(0, 3)
            .map((x) => x.name)
            .join(', '),
        })
      : undefined,
  }
}

import type { Country, FilmPrint, Format, LanguageVersion, Movie, Person } from '@app/types/payload'
import type { TFunction } from 'i18next'

export type Props = {
  filmPrint: FilmPrint
  t: TFunction
}
export type MovieSpecsItem =
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

export const getMovieSpecs = ({ filmPrint, t }: Props): MovieSpecs => {
  const movie = filmPrint.movie as Movie

  if (movie.directors.length && typeof movie.directors[0] === 'string') {
    throw new Error('movieSpecs expects more depth')
  }

  const countries = (movie.countries as Country[])?.map((x) => x.name).join(', ')
  const year = `${movie.year}`

  return {
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
    format: filmPrint.format && (filmPrint.format as Format)?.name,
    language: filmPrint.languageVersion && (filmPrint.languageVersion as LanguageVersion)?.name,
    languageShort:
      filmPrint.languageVersion && (filmPrint.languageVersion as LanguageVersion)?.abbreviation,
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

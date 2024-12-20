import type {
  Country,
  FilmPrint,
  Format,
  Genre,
  LanguageVersion,
  Movie,
  Person,
} from '@/payload-types'
import { type TFunction } from 'i18next'

export const movieSpecs = ({
  movie,
  filmPrint,
  t,
}: {
  movie: Movie
  filmPrint: FilmPrint
  t: TFunction
}): string[] => {
  return [
    movie.originalTitle,
    (movie.genres as Genre[])?.map((x) => x.name).join(', '),
    (movie.countries as Country[])?.map((x) => x.name).join(', '),
    `${movie.year}`,
    movie.directors &&
      t('directed by {directors}', {
        directors: (movie.directors as Person[])?.map((x) => x.name).join(', '),
      }),
    t('duration {duration}', { duration: movie.duration }),
    (filmPrint?.format as Format)?.name,
    // movie.ageRating ? t('ageRating {age}', { age: movie.ageRating}) : "",
    filmPrint && (filmPrint.languageVersion as LanguageVersion)?.name,
    movie.cast?.length
      ? t('starring {actors}', {
          actors: (movie.cast as Person[])
            ?.slice(0, 3)
            .map((x) => x.name)
            .join(', '),
        })
      : '',
  ].filter(Boolean)
}

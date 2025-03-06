import React from 'react'
import type { TFunction } from '@app/i18n'
import type { FilmPrint, Movie, Person } from '@app/types/payload'
import { getMovieSpecsString } from '@app/util/data/getMovieSpecsString'
import { Text, View } from '@react-pdf/renderer'

type Props = {
  filmPrint: FilmPrint
  t: TFunction
}

export const SupportingFilm: React.FC<Props> = ({ filmPrint, t }) => {
  const movie = filmPrint.movie as Movie
  const { title, originalTitle } = movie

  const displayTitle =
    originalTitle && originalTitle !== title ? `${title} (${originalTitle})` : title

  return (
    <View>
      <Text style={{ fontWeight: 'semibold' }}>
        {t('pdf.supportingFilm')}: {displayTitle}
      </Text>
      <Text>
        {t('directed by {directors}', {
          directors: movie.directors.map((p) => (p as Person).name).join(', '),
        })}
      </Text>
      <Text>
        {getMovieSpecsString({
          items: ['countriesAndYear', 'duration', 'format', 'language'],
          filmPrint,
          t,
        })}
      </Text>
    </View>
  )
}

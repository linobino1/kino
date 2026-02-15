import React from 'react'
import type { TFunction } from '@app/i18n'
import type { FilmPrint, Movie } from '@app/types/payload'
import type { ViewProps } from '@react-pdf/renderer'
import { getMovieSpecs } from '@app/util/data/getMovieSpecs'
import { getMovieSpecsString } from '@app/util/data/getMovieSpecsString'
import { Text, View } from '@react-pdf/renderer'

type Props = ViewProps & {
  filmPrint: FilmPrint
  t: TFunction
}

export const MainFilmSpecs: React.FC<Props> = ({ filmPrint, t, ...props }) => {
  const movie = filmPrint.movie as Movie
  const { title, originalTitle } = movie
  const specs = getMovieSpecs({ filmPrint, t })

  return (
    <View {...props}>
      <Text style={{ fontWeight: 'semibold' }}>{originalTitle}</Text>
      {title !== originalTitle && <Text style={{ fontStyle: 'italic' }}>{title}</Text>}
      <Text>{specs.countriesAndYear}</Text>

      <Text style={{ marginTop: 8 }}>{specs.directors}</Text>
      <Text>
        {getMovieSpecsString({
          filmPrint,
          t,
          type: 'filmPrintInfosShort',
          hideDCP: true,
          hideGermanLanguageVersionForGermanMovies: true,
        })}
      </Text>
    </View>
  )
}

import type { FilmPrint as FilmPrintType, Media, Movie as MovieType } from '@app/types/payload'
import type { Locale, TFunction } from '@app/i18n'
import { SerializeLexicalToEmail } from '../lexical/SerializeLexicalToEmail'
import { env } from '@app/util/env/backend.server'
import { getMovieSpecsString } from '@app/util/data/getMovieSpecsString'
import Section from './Section'

type MovieProps = {
  filmPrint: FilmPrintType
  color: string
  additionalText?: any
  locale: Locale
  t: TFunction
}

const FilmPrint: React.FC<MovieProps> = ({ filmPrint, color, additionalText, locale, t }) => {
  const movie = filmPrint.movie as MovieType

  const subtitle = getMovieSpecsString({
    type: 'newsletterSubtitle',
    filmPrint,
    t,
    separator: ', ',
  })

  const url = `${env.FRONTEND_URL}${filmPrint.url}`

  return (
    <Section
      header={movie.still as Media}
      title={movie.title}
      subtitle={subtitle}
      description={movie.synopsis}
      url={url}
      color={color}
    >
      {additionalText && (
        <SerializeLexicalToEmail
          nodes={additionalText.root.children as any}
          color={color}
          locale={locale}
          t={t}
        />
      )}
    </Section>
  )
}

export default FilmPrint

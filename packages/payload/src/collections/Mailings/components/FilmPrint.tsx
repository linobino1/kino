import { Container, Heading, Img, Section, Text } from '@react-email/components'
import type { FilmPrint as FilmPrintType, Media, Movie as MovieType } from '@app/types/payload'
import type { Locale, TFunction } from '@app/i18n'
import { SerializeLexicalToEmail } from '../lexical/SerializeLexicalToEmail'
import { bgGrey, containerWidth, fontSize } from '../templates/Newsletter'
import Shorten from './Shorten'
import { env } from '@app/util/env/backend.server'
import { getMovieSpecsString } from '@app/util/data/getMovieSpecsString'

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
    <Section style={{ backgroundColor: bgGrey, paddingBlock: '20px' }}>
      <Container
        style={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxWidth: containerWidth,
        }}
      >
        <Img
          src={(movie.still as Media).url ?? ''}
          style={{
            width: '100%',
            height: 'auto',
            aspectRatio: '16 / 9',
            objectFit: 'cover',
          }}
        />
        <Container style={{ padding: '20px' }}>
          <Heading
            style={{
              borderColor: color,
              marginBlock: 0,
              fontSize: '23px',
            }}
          >
            {movie.title}
          </Heading>
          {subtitle && (
            <Text style={{ marginBlock: 0, fontSize, fontStyle: 'italic' }}>{subtitle}</Text>
          )}
          <Text style={{ fontSize }}>
            <Shorten text={movie?.synopsis} moreLink={url} color={color} />
          </Text>
          {additionalText && (
            <SerializeLexicalToEmail
              nodes={additionalText.root.children as any}
              color={color}
              locale={locale}
              t={t}
            />
          )}
        </Container>
      </Container>
    </Section>
  )
}

export default FilmPrint

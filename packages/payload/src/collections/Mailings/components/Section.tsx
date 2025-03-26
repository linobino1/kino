import type { Media } from '@app/types/payload'
import { mailingsLocale } from '@app/i18n'
import { Container, Heading, Section as _Section, Text, Link } from '@react-email/components'
import { bgGrey, fontSize } from '../templates/Newsletter'
import Img from './Img'
import Shorten from './Shorten'
import { formatDate } from '@app/util/formatDate'

type MovieProps = {
  header?: Media
  date?: Date
  title?: string
  subtitle?: string
  description?: string
  url: string
  children?: React.ReactNode // will be appended to the end of the section
  color: string
}

const Section: React.FC<MovieProps> = ({
  header,
  date,
  title,
  subtitle,
  description,
  url,
  color,
  children,
}) => {
  return (
    <_Section style={{ backgroundColor: bgGrey, paddingBlock: '20px' }}>
      <Container
        style={{
          backgroundColor: '#FFFFFF',
        }}
      >
        <Link href={url} style={{ display: 'contents' }}>
          {header && (
            <Img
              src={header.url ?? ''}
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '16 / 9',
                objectFit: 'cover',
              }}
            />
          )}
          {date && (
            <Text
              style={{
                color: '#000000',
                borderColor: color,
                borderStyle: 'inset',
                borderWidth: '2px',
                padding: '10px',
                margin: 0,
                fontSize: '18px',
                lineHeight: '27px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {`${formatDate(date, 'dd. LLL - p', mailingsLocale)} Uhr`}
            </Text>
          )}
        </Link>
        <Container className="mt-4 px-4">
          {title && (
            <Heading
              style={{
                borderColor: color,
                marginBlock: 0,
                fontSize: '23px',
              }}
            >
              {title}
            </Heading>
          )}
          {subtitle && (
            <Text style={{ marginBlock: 0, fontSize, fontStyle: 'italic' }}>{subtitle}</Text>
          )}
          {description && (
            <Text style={{ fontSize, textAlign: 'justify' }}>
              <Shorten text={description} moreLink={url} color={color} />
            </Text>
          )}
          {children}
        </Container>
      </Container>
    </_Section>
  )
}

export default Section

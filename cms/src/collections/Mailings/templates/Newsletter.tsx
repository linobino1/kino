import React from 'react'
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Section,
  Text,
  Font,
} from '@react-email/components'
import type { Mailing, Media } from '@/payload-types'
import { seed } from '../seed'
import { SerializeLexicalToEmail } from '../lexical/SerializeLexicalToEmail'
import { parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { formatInTimeZone } from 'date-fns-tz'

const tz = process.env.TIMEZONE ?? 'Europe/Berlin'

export const formatDate = (iso: string, format: string) => {
  const date = parseISO(iso)
  return formatInTimeZone(date, tz, format, { locale: de })
}

export type Props = {
  mailing: Omit<Mailing, 'updatedAt' | 'createdAt' | 'id'>
}

export const bgGrey = '#f2f2f2'
export const textGrey = '#7f8c8d'
export const containerWidth = 580
export const fontSize = '16px'

export default function Newsletter({ mailing }: Props) {
  const color = mailing.color ?? '#000'
  const { footer } = mailing

  return (
    <Html
      lang={mailing.language ?? 'de'}
      dir="ltr"
      style={{
        fontFamily: 'Helvetica, Arial, sans',
        fontSize: '16px',
        margin: 0,
        padding: 0,
      }}
    >
      <Head>
        <Font
          fontFamily="Open Sans"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/opensans/v40/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Open Sans"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/opensans/v40/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2',
            format: 'woff2',
          }}
          fontWeight={700}
          fontStyle="bold"
        />
      </Head>
      <Body style={{ padding: 0, margin: 0 }}>
        <Container
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <Link
            style={{
              color: textGrey,
              fontSize: '12px',
            }}
            href="{{ MessageURL }}"
          >
            Diese E-Mail im Browser anzeigen
          </Link>
        </Container>
        {mailing.header?.image && typeof mailing.header.image === 'object' && (
          <Img
            src={(mailing.header.image as Media).url ?? ''}
            alt="header"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '400px',
            }}
          />
        )}
        {mailing.header?.overlay && typeof mailing.header.overlay === 'object' && (
          <Img
            src={(mailing.header.overlay as Media).url ?? ''}
            alt="header"
            style={{
              position: 'absolute',
              top: 0,
              objectFit: 'contain',
              width: '100%',
              height: '400px',
            }}
          />
        )}
        <SerializeLexicalToEmail nodes={mailing.content?.root.children as any} color={color} />
        {typeof footer?.image === 'object' && footer.label && footer.link && (
          <Section
            style={{
              width: '100%',
              backgroundImage: `url(${encodeURI((footer.image as Media).url ?? '')})`,
              backgroundSize: 'cover',
              minHeight: '40px',
              textAlign: 'center',
            }}
          >
            <Link
              href={footer.link}
              style={{
                color,
                display: 'inline-block',
                backgroundColor: bgGrey,
                borderWidth: '1px',
                borderColor: color,
                borderRadius: '50px',
                borderStyle: 'solid',
                fontSize: '17px',
                fontWeight: 'bold',
                padding: '8px 24px',
                margin: '20px',
              }}
            >
              {footer.label}
            </Link>
          </Section>
        )}
        <Container
          style={{
            color: textGrey,
            textAlign: 'center',
            fontSize: '12px',
            lineHeight: '18px',
          }}
        >
          <Section style={{ padding: '20px' }}>
            <Text style={{ lineHeight: '18px' }}>
              Kino im Blauen Salon e.V.
              <br />
              HfG Karlsruhe
              <br />
              Lorenzstraße 15
              <br />
              76135 Karlsruhe
              <br />
              <Link href="https://kinoimblauensalon.de">www.kinoimblauensalon.de</Link>
              <br />
              <br />
              <br />
              <Link href="{{ UnsubscribeURL }}" style={{ color: textGrey }}>
                newsletter abbestellen
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// this is for using the react-email dev server with `pnpm email`
Newsletter.PreviewProps = seed

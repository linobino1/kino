import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Section,
  Text,
  Font,
  Tailwind,
} from '@react-email/components'
import type { Mailing, Media } from '@app/types/payload'
import { SerializeLexicalToEmail } from '../lexical/SerializeLexicalToEmail'
import { getObjectPosition } from '@app/util/media/getObjectPosition'
import type { Locale, TFunction } from '@app/i18n'

export type Props = {
  mailing: Omit<Mailing, 'updatedAt' | 'createdAt' | 'id'>
  locale: Locale
  t: TFunction
}

export const bgGrey = '#f2f2f2'
export const textGrey = '#7f8c8d'
export const fontSize = '16px'

export default function Newsletter({ mailing, locale, t }: Props) {
  const color = mailing.color ?? '#000'
  const { footer } = mailing

  const header = mailing.header?.image
  const overlay = mailing.header?.overlay
  if (typeof header === 'string' || typeof overlay === 'string') {
    throw new Error('not enough depth')
  }

  return (
    <Html
      lang={locale}
      dir="ltr"
      style={{
        fontFamily: 'Helvetica, Arial, sans',
        fontSize: '16px',
        margin: 0,
        padding: 0,
      }}
    >
      <Tailwind>
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
          {/* faux absolute positioning https://www.goodemailcode.com/email-enhancements/faux-absolute-position.html */}
          <div
            style={{
              maxHeight: 0,
              position: 'relative',
              opacity: 0.999,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                width: '100%',
                marginTop: 0,
                marginLeft: 0,
                textAlign: 'center',
              }}
            >
              <Link
                style={{
                  color: '#666',
                  fontSize: '12px',
                }}
                href="{{ MessageURL }}"
              >
                {t('mailings.openEmailInBrowser')}
              </Link>
            </div>
          </div>
          {header && (
            <Section
              className="h-[200px] sm:h-[400px]"
              style={{
                width: '100%',
                backgroundImage: `url(${encodeURI(header.url ?? '')})`,
                backgroundSize: 'cover',
                backgroundPosition: getObjectPosition(header),
                paddingBlock: '20px',
              }}
            >
              {/* black transparent overlay using faux absolute positioning https://www.goodemailcode.com/email-enhancements/faux-absolute-position.html */}
              <div
                style={{
                  maxHeight: 0,
                  position: 'relative',
                  opacity: 0.999,
                }}
              >
                <div
                  className="h-[200px] sm:h-[400px]"
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    marginTop: 0,
                    marginLeft: 0,
                  }}
                />
              </div>
              {overlay && (
                <Container
                  className="h-[160px] sm:h-[360px]"
                  style={{
                    backgroundImage: `url(${encodeURI(overlay.url ?? '')})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                />
              )}
            </Section>
          )}
          <Section style={{ backgroundColor: '#fff' }}>
            <SerializeLexicalToEmail
              nodes={mailing.content?.root.children as any}
              color={color}
              locale={locale}
              t={t}
            />
          </Section>
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
                Kino im Blauen Salon
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
      </Tailwind>
    </Html>
  )
}

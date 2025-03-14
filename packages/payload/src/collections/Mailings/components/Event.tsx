import { Container, Heading, Img, Link, Section, Text } from '@react-email/components'
import React from 'react'
import type { FilmPrint, Media, Movie, Event as EventType } from '@app/types/payload'
import type { Locale, TFunction } from '@app/i18n'
import { SerializeLexicalToEmail } from '../lexical/SerializeLexicalToEmail'
import { bgGrey, containerWidth, fontSize } from '../templates/Newsletter'
import { env } from '@app/util/env/backend.server'
import { formatDate } from '@app/util/formatDate'
import { mailingsLocale } from '@app/i18n'
import { getMovieSpecsString } from '@app/util/data/getMovieSpecsString'
import Shorten from './Shorten'
import Hr from './Hr'

type EventProps = {
  event: EventType
  color: string
  additionalText?: any
  locale: Locale
  t: TFunction
}

const Event: React.FC<EventProps> = ({ event, color, additionalText, locale, t }) => {
  const subtitle = event.isScreeningEvent
    ? getMovieSpecsString({
        type: 'newsletterSubtitle',
        filmPrint: event.mainProgramFilmPrint as FilmPrint,
        t,
        separator: ', ',
      })
    : (event.subtitle ?? '')

  const url = `${env.FRONTEND_URL}${event.url}`

  const supportingProgramItems = event.programItems?.filter(
    (x) => !x.isMainProgram && x.type === 'screening',
  )

  return (
    <Section style={{ backgroundColor: bgGrey, paddingBlock: '20px' }}>
      <Container
        style={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxWidth: containerWidth,
        }}
      >
        <Link href={url} style={{ display: 'contents' }}>
          <Img
            src={(event.header as Media).url ?? ''}
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '16 / 9',
              objectFit: 'cover',
            }}
          />
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
            {`${formatDate(event.date, 'dd. LLL - p', mailingsLocale)} Uhr`}
          </Text>
        </Link>
        <Container style={{ padding: '20px' }}>
          <Heading
            style={{
              borderColor: color,
              marginBlock: 0,
              fontSize: '23px',
            }}
          >
            {event.title}
          </Heading>
          {subtitle && (
            <Text style={{ marginBlock: 0, fontSize, fontStyle: 'italic' }}>{subtitle}</Text>
          )}
          <Text style={{ fontSize }}>
            <Shorten text={event.shortDescription ?? ''} moreLink={url} color={color} />
          </Text>
          {additionalText && (
            <SerializeLexicalToEmail
              nodes={additionalText.root.children as any}
              color={color}
              locale={locale}
              t={t}
            />
          )}
          {supportingProgramItems?.length ? (
            <>
              <Hr color={color} style={{ marginTop: '1.5em' }} />
              {supportingProgramItems.map(({ filmPrint }, index) => (
                <React.Fragment key={index}>
                  <Text style={{ fontSize, marginBottom: 0 }}>
                    <span>{t('mailings.event.supportingFilm')}: </span>
                    <span style={{ fontWeight: 'bold' }}>
                      {`${((filmPrint as FilmPrint).movie as Movie).title} (${
                        ((filmPrint as FilmPrint).movie as Movie).year
                      })`}
                    </span>
                  </Text>
                  <Text style={{ fontSize, marginTop: 0, fontStyle: 'italic' }}>
                    {getMovieSpecsString({
                      items: ['directors', 'countries', 'format', 'language'],
                      filmPrint: filmPrint as FilmPrint,
                      t,
                      separator: ', ',
                    })}
                  </Text>
                </React.Fragment>
              ))}
            </>
          ) : null}
        </Container>
      </Container>
    </Section>
  )
}

export default Event

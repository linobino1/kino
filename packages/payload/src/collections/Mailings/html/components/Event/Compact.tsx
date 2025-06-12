import type { FilmPrint, Media, Movie, Event as EventType } from '@app/types/payload'
import type { Locale, TFunction } from '@app/i18n'
import React from 'react'
import { Text } from '@react-email/components'
import { SerializeLexicalToEmail } from '../../lexical/SerializeLexicalToEmail'
import { fontSize } from '../../templates/Newsletter'
import { env } from '@app/util/env/backend.server'
import { getMovieSpecsString } from '@app/util/data/getMovieSpecsString'
import Hr from '../Hr'
import Section from '../Section'
import { getEventSubtitle } from '@app/util/data/getEventSubtitle'

type EventProps = {
  event: EventType
  color: string
  additionalText?: any
  locale: Locale
  t: TFunction
}

const Compact: React.FC<EventProps> = ({ event, color, additionalText, locale, t }) => {
  const subtitle = getEventSubtitle({
    event,
    t,
    movieSpecsProps: { type: 'newsletterSubtitle', separator: ', ' },
  })

  const url = `${env.FRONTEND_URL}${event.url}`

  const supportingProgramItems = event.programItems?.filter(
    (x) => !x.isMainProgram && x.type === 'screening',
  )

  return (
    <Section
      header={event.header as Media}
      title={event.title ?? ''}
      subtitle={subtitle}
      date={new Date(event.date)}
      url={url}
      description={event.shortDescription ?? ''}
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
    </Section>
  )
}

export default Compact

import type { FilmPrint, Media, Movie, Event as EventType } from '@app/types/payload'
import type { Locale, TFunction } from '@app/i18n'
import React from 'react'
import { SerializeLexicalToEmail } from '../../lexical/SerializeLexicalToEmail'
import { env } from '@app/util/env/backend.server'
import { lexicalToPlainText } from '@app/util/lexical/lexicalToPlainText'
import { getMovieSpecsString } from '@app/util/data/getMovieSpecsString'
import Section from '../Section'

type EventProps = {
  event: EventType
  color: string
  additionalText?: any
  locale: Locale
  t: TFunction
}

const UnfoldProgramItems: React.FC<EventProps> = ({ event, color, additionalText, locale, t }) => {
  const url = `${env.FRONTEND_URL}${event.url}`

  return (
    <>
      <Section
        header={event.header as Media}
        title={event.title ?? ''}
        subtitle={event.subtitle ?? undefined}
        date={new Date(event.date)}
        url={url}
        description={event.intro ? lexicalToPlainText(event.intro) : undefined}
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
      {event.programItems?.map(({ type, filmPrint, info }, index) => (
        <Section
          key={index}
          header={
            type === 'screening'
              ? (((filmPrint as FilmPrint).movie as Movie).still as Media)
              : undefined
          }
          title={type === 'screening' ? ((filmPrint as FilmPrint).movie as Movie).title : undefined}
          subtitle={
            type === 'screening'
              ? getMovieSpecsString({
                  filmPrint: filmPrint as FilmPrint,
                  t,
                  type: 'newsletterSubtitle',
                  separator: ', ',
                })
              : undefined
          }
          url={url}
          description={
            type === 'screening'
              ? ((filmPrint as FilmPrint).movie as Movie).synopsis
              : lexicalToPlainText(info)
          }
          color={color}
        >
          {type === 'screening' && info && (
            <SerializeLexicalToEmail
              nodes={info.root.children as any}
              color={color}
              locale={locale}
              t={t}
            />
          )}
        </Section>
      ))}
    </>
  )
}

export default UnfoldProgramItems

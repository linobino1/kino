import React from 'react'
import type { TFunction } from '@app/i18n'
import type { EventSery, Event as EventType, FilmPrint, Media, Movie } from '@app/types/payload'
import { Text, View, Image } from '@react-pdf/renderer'
import { Page } from '../components/Page'
import { getEventSubtitle } from '@app/util/data/getEventSubtitle'
import { formatDate } from '@app/util/formatDate'
import { getOptimizedImageUrl } from '@app/util/media/getOptimizedImageUrl'
import { colors } from '../util/styles'
import { lexicalToPlainText } from '@app/util/lexical/lexicalToPlainText'
import { SupportingFilm } from './SupportingFilm'
import { MainFilmSpecs } from './MainFilmSpecs'
import { EventLocationAndDate } from './EventLocationAndDate'
import { env } from '@app/util/env/frontend.server'

type Props = {
  event: EventType
  t: TFunction
}

const imageWidth = 320
const imageAspectRatio = 16 / 9
const imageUpscaleFactor = 4
const imageHeight = imageWidth / imageAspectRatio

export const Event: React.FC<Props> = ({ event, t }) => {
  const subtitle = getEventSubtitle({ event, t })
  const media = event.header as Media
  const optimizedMediaUrl = getOptimizedImageUrl(media, env, {
    width: imageUpscaleFactor * imageWidth,
    height: imageUpscaleFactor * imageHeight,
    format: 'jpeg',
  })

  // sort main program items first for screenings
  const programItems = event.programItems
  if (event.isScreeningEvent) {
    programItems?.sort((a, b) => {
      if (a.isMainProgram && !b.isMainProgram) {
        return -1
      }
      if (b.isMainProgram && !a.isMainProgram) {
        return 1
      }
      return 0
    })
  }

  return (
    // <Page key={event.id} t={t} style={{ paddingBottom: pageMargin + 200 }}>
    <Page key={event.id} t={t}>
      <Text style={{ fontSize: 14, marginTop: 16 }}>{formatDate(event.date, 'dd.MM.yyyy')}</Text>
      <View
        style={{
          display: 'flex',
          flexDirection: event.isScreeningEvent ? 'row' : 'column',
          fontSize: 16,
          marginTop: 0,
          gap: 0,
        }}
      >
        <Text style={{ fontWeight: 700 }}>{event.title}</Text>
        {event.isScreeningEvent ? (
          <React.Fragment>
            <Text> </Text>
            <Text>{`(${subtitle})`}</Text>
          </React.Fragment>
        ) : (
          <Text style={{ fontSize: 14 }}>{subtitle}</Text>
        )}
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          columnGap: 20,
          alignItems: 'flex-end',
          marginTop: 12,
        }}
      >
        <View style={{ width: imageWidth, height: imageHeight, marginTop: 4 }}>
          <Image
            src={optimizedMediaUrl}
            style={{
              flexShrink: '0',
              width: imageWidth,
              height: imageHeight,
              objectFit: 'cover',
              objectPositionX: `${media.focalX ?? 0.5 * 100}%`,
              objectPositionY: `${media.focalY ?? 0.5 * 100}%`,
            }}
          />
        </View>
        {event.isScreeningEvent && (
          <MainFilmSpecs
            filmPrint={event.mainProgramFilmPrint as FilmPrint}
            t={t}
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: '0',
              width: 180,
              textAlign: 'right',
            }}
          />
        )}
      </View>
      {event.series && (
        <View
          style={{
            width: imageWidth,
            backgroundColor: colors.blue,
            color: 'white',
            padding: 4,
            fontSize: 12,
            fontWeight: 'semibold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Text>{event.series?.map((s) => (s as EventSery).name).join(', ')}</Text>
        </View>
      )}
      <View style={{ marginTop: 12 }}>
        {event.intro && <Text>{lexicalToPlainText(event.intro)}</Text>}
        {programItems?.map(({ type, isMainProgram, info, filmPrint }, index) => (
          <View key={index} style={{ marginTop: 12, textAlign: 'justify' }}>
            {type === 'screening' ? (
              isMainProgram ? (
                <Text>{((filmPrint as FilmPrint).movie as Movie).synopsis}</Text>
              ) : (
                <SupportingFilm filmPrint={filmPrint as FilmPrint} t={t} />
              )
            ) : (
              info && <Text>{lexicalToPlainText(info)}</Text>
            )}
          </View>
        ))}
      </View>
      <EventLocationAndDate event={event} t={t} />
    </Page>
  )
}

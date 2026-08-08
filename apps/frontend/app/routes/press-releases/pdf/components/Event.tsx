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

type ProgramItem = NonNullable<EventType['programItems']>[number]

const imageWidth = 320
const imageAspectRatio = 16 / 9
const imageUpscaleFactor = 4
const imageHeight = imageWidth / imageAspectRatio
const programItemImageWidth = 90
const programItemImageHeight = 135

const getMedia = (media: unknown) => (media && typeof media === 'object' ? (media as Media) : null)

const getProgramItemPoster = (programItem: ProgramItem) => {
  if (programItem.isMainProgram) {
    return null
  }

  if (programItem.poster && typeof programItem.poster === 'object') {
    return programItem.poster as Media
  }

  if (programItem.type !== 'screening' || !programItem.filmPrint || typeof programItem.filmPrint !== 'object') {
    return null
  }

  const movie = (programItem.filmPrint as FilmPrint).movie
  if (!movie || typeof movie !== 'object' || !movie.poster || typeof movie.poster !== 'object') {
    return null
  }

  return movie.poster as Media
}

export const Event: React.FC<Props> = ({ event, t }) => {
  const subtitle = getEventSubtitle({ event, t, hideDCP: true })
  const media = getMedia(event.header)
  const imageRightsHolder = media?.rightsholder?.trim() || event.mainFilmDistributor?.trim()
  // AVIF and some other source formats do not render in react-pdf during development
  // because getOptimizedImageUrl returns the original file instead of a transformed JPEG.
  const optimizedMediaUrl = media
    ? getOptimizedImageUrl(media, env, {
        width: imageUpscaleFactor * imageWidth,
        height: imageUpscaleFactor * imageHeight,
        format: 'jpeg',
      })
    : null

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

  const firstNonMainProgramItemIndex = programItems?.findIndex((item) => !item.isMainProgram) ?? -1

  return (
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
        {media && optimizedMediaUrl && (
          <View style={{ width: imageWidth, marginTop: 4 }}>
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
        )}
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
      <View style={{ marginTop: 6, marginBottom: 0 }}>
        {event.intro && <Text>{lexicalToPlainText(event.intro)}</Text>}
        {programItems?.map((programItem, index) => {
          const { type, isMainProgram, info, filmPrint } = programItem
          const poster = getProgramItemPoster(programItem)
          const posterUrl = poster
            ? getOptimizedImageUrl(poster, env, {
                width: imageUpscaleFactor * programItemImageWidth,
                height: imageUpscaleFactor * programItemImageHeight,
                fit: 'max',
                format: 'jpeg',
              })
            : null
          const posterRightsHolder = poster?.rightsholder?.trim()

          const content =
            type === 'screening' ? (
              isMainProgram ? (
                <Text>
                  {lexicalToPlainText(((filmPrint as FilmPrint).movie as Movie).synopsis)}
                </Text>
              ) : (
                <SupportingFilm filmPrint={filmPrint as FilmPrint} t={t} />
              )
            ) : (
              info && <Text>{lexicalToPlainText(info)}</Text>
            )

          return (
            <View
              key={index}
              style={{
                marginTop: !isMainProgram && index === firstNonMainProgramItemIndex ? 22 : 12,
                marginBottom: 0,
                textAlign: 'justify',
              }}
            >
              {!isMainProgram && posterUrl ? (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    columnGap: 12,
                    alignItems: 'flex-start',
                  }}
                >
                  <View style={{ width: programItemImageWidth }}>
                    <Image
                      src={posterUrl}
                      style={{
                        width: programItemImageWidth,
                        height: programItemImageHeight,
                        objectFit: 'contain',
                      }}
                    />
                    {posterRightsHolder && (
                      <Text
                        style={{
                          marginTop: 4,
                          fontSize: 8,
                          color: '#666666',
                          textAlign: 'center',
                        }}
                      >
                        {`© ${posterRightsHolder}`}
                      </Text>
                    )}
                  </View>
                  <View style={{ flexGrow: 1, flexShrink: 1 }}>{content}</View>
                </View>
              ) : (
                content
              )}
            </View>
          )
        })}
      </View>
      <EventLocationAndDate event={event} t={t} />
      {imageRightsHolder && (
        <Text
          style={{
            marginTop: 6,
            marginBottom: 6,
            fontSize: 8,
            color: '#666666',
            textAlign: 'right',
          }}
        >
          {t('pdf.stillRights', { rightsHolder: imageRightsHolder })}
        </Text>
      )}
    </Page>
  )
}

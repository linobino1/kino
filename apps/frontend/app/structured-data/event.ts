import type { Event, Site } from '@app/types/payload'
import type { ItemList, ScreeningEvent, Event as SchemaOrgEvent } from 'schema-dts'
import { locationSchema } from './location'
import { itemList } from '.'
import { movieSchema } from './movie'

export const eventSchema = (event: Event, site?: Site): SchemaOrgEvent | ScreeningEvent | null => {
  let res: SchemaOrgEvent | ScreeningEvent = {
    '@type': 'Event',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    name: event.title as string,
    description: event.shortDescription as string,
    startDate: event.date,
    location: site ? locationSchema(site) : undefined,
  }

  // add ScreeningEvent specific properties
  if (event.isScreeningEvent) {
    const filmPrint = event.mainProgramFilmPrint

    if (!filmPrint || typeof filmPrint === 'string') {
      return null
    }

    const movie = filmPrint.movie

    if (!movie || typeof movie === 'string') {
      return null
    }

    const workPresented = movieSchema(movie)

    if (!workPresented) {
      return null
    }

    res = {
      ...res,
      '@type': 'ScreeningEvent',
      endDate: new Date(new Date(event.date).getTime() + movie.duration * 60 * 1000).toISOString(),
      workPresented,
    }
  }

  return res
}

export const eventsListSchema = (events: Event[], site?: Site): ItemList => {
  return itemList(events.map((s) => eventSchema(s, site)).filter((s) => s !== null))
}

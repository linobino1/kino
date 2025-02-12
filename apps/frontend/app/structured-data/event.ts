import { parseISO } from 'date-fns'
import type { FilmPrint, Movie, Event, Site } from '@app/types/payload'
import type { ItemList, ScreeningEvent, Event as SchemaOrgEvent } from 'schema-dts'
import { locationSchema } from './location'
import { itemList } from '.'
import { movieSchema } from './movie'

export const eventSchema = (event: Event, site?: Site): SchemaOrgEvent | ScreeningEvent => {
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
    const movie = (event.mainProgramFilmPrint as FilmPrint).movie as Movie
    res = {
      ...res,
      '@type': 'ScreeningEvent',
      workPresented: movieSchema(movie),
      endDate: new Date(parseISO(event.date).getTime() + movie.duration * 60 * 1000).toISOString(),
    }
  }

  return res
}

export const eventsListSchema = (events: Event[], site?: Site): ItemList => {
  return itemList(events.map((s) => eventSchema(s, site)))
}

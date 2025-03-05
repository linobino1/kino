import type { Route } from './+types/events-block-endpoint'
import type { Where } from 'payload'
import type { Locale } from '@app/i18n'
import { getPayload } from '~/util/getPayload.server'

export type RequestBody =
  | {
      collection: 'events'
      eventIDs: string[]
      locale: Locale
    }
  | {
      collection: 'eventSeries'
      eventSeriesID: string
      locale: Locale
    }

/**
 * expects a body with many event ids or one eventSeries id:
 * {
 *   "collection": "events",
 *   "ids": [
 *      "123",
 *      "456"
 *    ],
 *    "locale": "en"
 * }
 *
 * or
 *
 * {
 *  "collection": "eventSeries",
 *  "id": "123",
 *  "locale": "en"
 * }
 *
 * Why are we not getting this data from the backend?
 * The idea is, that the backend is not required at all for the frontend to work. It might sleep until an admin accesses the admin panel. The Remix server-side can fetch the data from the database directly.
 */
export const action = async ({ request }: Route.ActionArgs) => {
  const payload = await getPayload()
  const body = (await request.json()) as RequestBody

  let where: Where
  switch (body.collection) {
    case 'events':
      if (!body.eventIDs) {
        throw new Error('ids required for events')
      }
      where = {
        id: {
          in: body.eventIDs,
        },
      }
      break

    case 'eventSeries':
      if (!body.eventSeriesID) {
        throw new Error('id required for eventSeries')
      }
      where = {
        series: {
          equals: body.eventSeriesID,
        },
      }
      break
  }

  const events = await payload.find({
    collection: 'events',
    where,
    sort: 'date',
    depth: 3,
    locale: body.locale,
  })

  return events
}

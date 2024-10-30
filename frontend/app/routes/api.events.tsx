import { ActionFunctionArgs } from '@remix-run/cloudflare'
import { Where } from 'payload'
import { Locale } from 'shared/config'
import { getPayload } from '~/util/getPayload.server'

export type RequestBody =
  | {
      collection: 'events'
      eventIDs: string[]
      locale: Locale
    }
  | {
      collection: 'screeningSeries'
      screeningSeriesID: string
      locale: Locale
    }
/**
 * expects a body with many event ids or one screeningSeries id:
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
 *  "collection": "screeningSeries",
 *  "id": "123",
 *  "locale": "en"
 * }
 *
 * Why are we not getting this data from the backend?
 * The idea is, that the backend is not required at all for the frontend to work. It might sleep until an admin accesses the admin panel. The Remix server-side can fetch the data from the database directly.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
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

    case 'screeningSeries':
      if (!body.screeningSeriesID) {
        throw new Error('id required for screeningSeries')
      }
      where = {
        series: {
          equals: body.screeningSeriesID,
        },
      }
      break
  }

  const events = payload.find({
    collection: 'events',
    where,
    depth: 2,
    locale: body.locale,
  })

  return events
}

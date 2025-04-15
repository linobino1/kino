import type { Location } from '@app/types/payload'
import type { Route } from './+types/ics'
import type { Locale } from '@app/i18n'
import { getPayload } from '~/util/getPayload.server'
import { siteTitle } from '@app/util/config'
import { env } from '@app/util/env/backend.server'
import * as ics from 'ics'
import { formatSlug } from '@app/util/formatSlug'

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData()
  const payload = await getPayload()

  const eventIDs = formData.getAll('events[]')
  const locale = formData.get('locale') as Locale

  if (!eventIDs.length || !locale) {
    throw new Response('Missing required fields', { status: 400 })
  }

  // compare date for upcoming events
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const events = (
    await payload.find({
      collection: 'events',
      where: {
        and: [
          {
            id: {
              in: eventIDs,
            },
            date: {
              greater_than_equal: today, // we don't want to include past events
            },
          },
        ],
      },
      select: {
        title: true,
        date: true,
        location: true,
        url: true,
      },
      depth: 1,
      locale,
    })
  ).docs

  const { error, value } = ics.createEvents(
    events.map((event) => ({
      uid: event.id,
      title: event.title as string,
      start: new Date(event.date).getTime(),
      duration: { hours: 2 },
      location: (event.location as Location | undefined)?.name ?? undefined,
      url: `${env.FRONTEND_URL}${event.url}`,
    })),
  )

  if (error) {
    console.error('Error generating .ics file', error)
    return new Response('Error generating .ics file', { status: 500 })
  }

  return new Response(value, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `inline; filename=${formatSlug(events.length === 1 ? events[0].title : siteTitle, { replacement: ' ', lower: false })}.ics`,
    },
  })
}

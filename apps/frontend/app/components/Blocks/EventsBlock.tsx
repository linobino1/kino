import type { Event, EventsBlockType, Site } from '@app/types/payload'
import { EventsList } from '../EventsList'
import { useRouteLoaderData } from '@remix-run/react'
import type { loader as rootLoader } from '~/root'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { RequestBody } from '~/routes/api.events'
import type { Locale } from '@app/i18n'

type Props = EventsBlockType

export const EventsBlock: React.FC<Props> = ({ type, eventSeries, events }) => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language as Locale
  const [loading, setLoading] = useState(true)
  const [docs, setDocs] = useState<Event[]>([])
  const site = useRouteLoaderData<typeof rootLoader>('root')?.site as unknown as Site

  // fetch screenings
  useEffect(() => {
    ;(async () => {
      let data: RequestBody
      switch (type) {
        case 'manual':
          data = {
            collection: 'events',
            eventIDs: events?.map((event: any) => event.doc?.id) ?? [],
            locale,
          }
          break

        case 'eventSeries':
          data = {
            collection: 'eventSeries',
            eventSeriesID: typeof eventSeries === 'string' ? eventSeries : (eventSeries?.id ?? ''),
            locale,
          }
          break
      }

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        return
      }

      const json = await res.json()

      setDocs(json.docs)
      setLoading(false)
    })()
  }, [type, events, eventSeries])

  return loading ? <p>{t('Loading...')}</p> : <EventsList items={docs} site={site} />
}

export default EventsBlock

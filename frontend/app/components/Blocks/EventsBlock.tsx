import type { Event, EventsBlockType, Site } from '@/payload-types'
import { EventsList } from '../EventsList'
import { useRouteLoaderData } from '@remix-run/react'
import type { loader as rootLoader } from '~/root'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { RequestBody } from '~/routes/api.events'
import { Locale } from 'shared/config'

type Props = EventsBlockType

export const EventsBlock: React.FC<Props> = ({ type, screeningSeries, events }) => {
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

        case 'screeningSeries':
          data = {
            collection: 'screeningSeries',
            screeningSeriesID:
              typeof screeningSeries === 'string' ? screeningSeries : (screeningSeries?.id ?? ''),
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
  }, [type, events, screeningSeries])

  return loading ? <p>{t('Loading...')}</p> : <EventsList items={docs} site={site} />
}

export default EventsBlock

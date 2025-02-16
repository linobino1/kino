import type { EventsBlockType, Site } from '@app/types/payload'
import type { action } from '~/routes/api/events-block-endpoint'
import type { Locale } from '@app/i18n'
import type { loader as rootLoader } from '~/root'
import { EventsList } from '../EventsList'
import { useFetcher, useRouteLoaderData } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

type Props = EventsBlockType

export const EventsBlock: React.FC<Props> = ({ type, eventSeries, events }) => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language as Locale
  const site = useRouteLoaderData<typeof rootLoader>('root')?.site as unknown as Site

  const { submit, data } = useFetcher<typeof action>()

  useEffect(() => {
    let body
    switch (type) {
      case 'manual':
        body = {
          collection: 'events',
          eventIDs: events?.map((event: any) => event.doc?.id) ?? [],
          locale,
        }
        break

      case 'eventSeries':
        body = {
          collection: 'eventSeries',
          eventSeriesID: typeof eventSeries === 'string' ? eventSeries : (eventSeries?.id ?? ''),
          locale,
        }
        break
    }

    submit(body, {
      action: '/api/events-block-endpoint',
      method: 'POST',
      encType: 'application/json',
    })
  }, [])

  // return <pre>{JSON.stringify(data, null, 2)}</pre>

  return data ? <EventsList events={data.docs} site={site} /> : <p>{t('Loading...')}</p>
}

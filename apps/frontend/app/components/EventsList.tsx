import type { Event, EventSery, Site } from '@app/types/payload'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { JsonLd } from '~/structured-data'
import { eventsListSchema } from '~/structured-data/event'
import { EventCard } from './EventCard'
import { cn } from '@app/util/cn'
import { ICSDownloadButton } from './ICSDownloadButton'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  from?: string
  events: Event[]
  site?: Site
  className?: string
  activeEventSery?: EventSery
  emptyMessage?: string
  showICSDownload?: boolean
}

export const EventsList: React.FC<Props> = ({
  events,
  activeEventSery,
  emptyMessage,
  site,
  showICSDownload = true,
  className,
  ...props
}) => {
  const { t } = useTranslation()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcomingEvents = events.filter((event) => event.date > today.toISOString())

  return (
    <div {...props} className={cn('my-8', className)}>
      {events.length ? (
        <>
          <JsonLd {...eventsListSchema(events, site)} />
          <ul className="xs:grid-cols-2 grid gap-4 max-sm:gap-y-8 md:grid-cols-3">
            {events.map((item) => (
              <li key={item.id}>
                <EventCard event={item} activeEventSery={activeEventSery} />
              </li>
            ))}
          </ul>
          {showICSDownload && upcomingEvents.length > 0 ? (
            <div className="mt-4 flex items-center justify-end gap-2 py-2 text-sm text-gray-300">
              <ICSDownloadButton
                events={upcomingEvents}
                className="mr-2 text-xl text-gray-300 transition-colors hover:text-white"
              />
            </div>
          ) : null}
        </>
      ) : (
        <div className="flex min-h-[50vh] items-center justify-center">
          {emptyMessage || t('No upcoming screenings.')}
        </div>
      )}
    </div>
  )
}

import type { Event, EventSery, Site } from '@app/types/payload'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { JsonLd } from '~/structured-data'
import { eventsListSchema as screeningsListMarkup } from '~/structured-data/event'
import { Link } from '~/components/localized-link'
import EventCard from './EventCard'
import { cn } from '@app/util/cn'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  from?: string
  items: Event[]
  site?: Site
  className?: string
  activeEventSery?: EventSery
  emptyMessage?: string
}

export const EventsList: React.FC<Props> = ({
  items,
  activeEventSery,
  emptyMessage,
  site,
  className,
  ...props
}) => {
  const { t } = useTranslation()

  return items?.length ? (
    <div
      {...props}
      className={cn(
        'xs:grid-cols-[repeat(auto-fill,minmax(13em,auto))] xs:grid-cols-2 my-4 grid gap-8 sm:grid-cols-[repeat(auto-fill,minmax(15em,auto))] sm:gap-4',
        className,
      )}
    >
      <JsonLd {...screeningsListMarkup(items, site)} />
      {items.map((item) => (
        <Link key={item.id} to={`/events/${item.slug as string}`} prefetch="intent">
          <EventCard event={item} activeEventSery={activeEventSery} />
        </Link>
      ))}
    </div>
  ) : (
    <div className="flex min-h-[50vh] items-center justify-center">
      {emptyMessage || t('No upcoming screenings.')}
    </div>
  )
}

export default EventsList

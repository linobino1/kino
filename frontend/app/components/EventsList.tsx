import type { Event, ScreeningSery, Site } from '@/payload-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { JsonLd } from '~/structured-data'
import { eventsListSchema as screeningsListMarkup } from '~/structured-data/screening'
import { Link } from '~/components/localized-link'
import EventCard from './EventCard'
import { cn } from '~/util/cn'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  from?: string
  items: Event[]
  site?: Site
  className?: string
  activeScreeningSery?: ScreeningSery
  emptyMessage?: string
}

export const EventsList: React.FC<Props> = ({
  items,
  activeScreeningSery,
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
        'xs:grid-cols-[repeat(auto-fill,minmax(13em,auto))] xs:grid-cols-2 my-4 grid gap-4 sm:grid-cols-[repeat(auto-fill,minmax(15em,auto))]',
        className,
      )}
    >
      {JsonLd(screeningsListMarkup(items, site))}
      {items.map((item) => (
        <Link key={item.id} to={`/events/${item.slug as string}`} prefetch="intent">
          <EventCard event={item} activeScreeningSery={activeScreeningSery} />
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

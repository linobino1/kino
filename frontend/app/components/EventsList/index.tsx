import { EventsListItem } from './item'
import type { Event, ScreeningSery, Site } from '@/payload-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { JsonLd } from '~/structured-data'
import { eventsListSchema as screeningsListMarkup } from '~/structured-data/screening'
import { Link } from '~/components/localized-link'
import { classes } from '~/classes'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  from?: string
  items: Event[]
  site: Site
  className?: string
  activeScreeningSery?: ScreeningSery
  emptyMessage?: string
}

export const EventsList: React.FC<Props> = ({
  items,
  className,
  activeScreeningSery,
  emptyMessage,
  site,
  ...props
}) => {
  const { t } = useTranslation()

  return items?.length ? (
    <div {...props} className={`${classes.list} ${className || ''}`}>
      {JsonLd(screeningsListMarkup(items, site))}
      {items.map((item) => (
        <Link key={item.id} to={`/events/${item.slug as string}`} prefetch="intent">
          <EventsListItem event={item} activeScreeningSery={activeScreeningSery} />
        </Link>
      ))}
    </div>
  ) : (
    <div className={classes.empty}>{emptyMessage || t('No upcoming screenings.')}</div>
  )
}

export default EventsList

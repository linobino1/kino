import React from 'react'
import type { Media, Event, ScreeningSery } from '@/payload-types'
import { Date as DateComponent } from '~/components/Date'
import { useTranslation } from 'react-i18next'
import { Image } from '~/components/Image'
import { classes } from '~/classes'

type Props = {
  event: Event
  activeScreeningSery?: ScreeningSery
}

export const EventsListItem: React.FC<Props> = ({ event, activeScreeningSery }) => {
  const { t } = useTranslation()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isPast = new Date(Date.parse(event.date)) < today
  return (
    <div className={classes.item}>
      <div className={classes.date}>
        <DateComponent iso={event.date as string} className={classes.dayName} format="EEEEEE" />
        <DateComponent iso={event.date as string} className={classes.month} format="MMM" />
        <DateComponent iso={event.date as string} className={classes.dayNumber} format="dd" />
        {isPast && (
          <DateComponent iso={event.date as string} className={classes.year} format="yyyy" />
        )}
      </div>
      <Image
        image={event.header as Media}
        srcSet={[
          { options: { width: 310, height: 310, fit: 'crop' }, size: '310w' },
          { options: { width: 450, height: 450, fit: 'crop' }, size: '450w' },
          { options: { width: 620, height: 620, fit: 'crop' }, size: '620w' },
          { options: { width: 900, height: 900, fit: 'crop' }, size: '900w' },
        ]}
        sizes="(max-width: 500px) 100vw, (max-width: 700px) 50vw, (max-width: 1024px) 33vw, 310px"
      />
      <div className={classes.info}>
        <div className={classes.tags}>
          {event.series && activeScreeningSery?.id !== (event.series as ScreeningSery)?.id && (
            <div className={`${classes.tag} ${classes.series}`}>
              {(event.series as ScreeningSery).name}
            </div>
          )}
        </div>
        <DateComponent iso={event.date as string} className={classes.time} format="p" />
        <div className={classes.title}>{event.title}</div>
        <div className={classes.footer}>{t('More Info')}</div>
      </div>
    </div>
  )
}

export default EventsListItem

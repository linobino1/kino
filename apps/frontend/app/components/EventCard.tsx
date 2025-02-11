import React from 'react'
import type { Media, Event, EventSery } from '@app/types/payload'
import { Date as DateComponent } from '~/components/Date'
import { useTranslation } from 'react-i18next'
import { Image } from '~/components/Image'
import { classes } from '~/classes'
import Tag from './Tag'
import { cn } from '~/util/cn'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  event: Event
  activeEventSery?: EventSery
}

export const EventCard: React.FC<Props> = ({ event, activeEventSery, className, ...props }) => {
  const { t } = useTranslation()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isPast = new Date(Date.parse(event.date)) < today
  return (
    <div
      {...props}
      className={cn(
        'relative flex flex-col bg-white text-black shadow-md transition-transform duration-200 ease-in-out hover:-translate-y-[7px]',
        className,
      )}
    >
      <div
        className="p3 absolute -top-2.5 left-2 flex flex-col items-center bg-white/80 pb-4 uppercase leading-[1]"
        style={{ textShadow: '0px 0px 10px rgb(0 0 0 / 30%)' }}
      >
        <DateComponent iso={event.date as string} className="" format="EEEEEE" />
        <DateComponent iso={event.date as string} className="" format="MMM" />
        <DateComponent
          iso={event.date as string}
          className="font-calendar text-4xl font-semibold"
          format="dd"
        />
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
        className="xs:aspect-square aspect-[16/9] object-cover"
      />
      <div className="flex flex-col sm:aspect-[3/2]">
        <div className="hide-scrollbar m-[0.3em] flex min-h-6 flex-row-reverse overflow-x-auto">
          <div className="w-max shrink-0 space-x-2">
            {((event.series ?? []) as EventSery[]).filter(Boolean).map(
              ({ id, name }, index) =>
                activeEventSery?.id !== id && (
                  <Tag className="inline" key={index}>
                    {name}
                  </Tag>
                ),
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 px-4 pb-4">
          <DateComponent
            iso={event.date as string}
            className="font-medium text-red-500"
            format="p"
          />
          <div className="font-semibold uppercase">{event.title}</div>
          <div className="flex flex-1 items-end text-sm uppercase text-gray-400">
            {t('More Info')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard

import React from 'react'
import type { Media, Event, EventSery } from '@app/types/payload'
import { Date as DateComponent } from '~/components/Date'
import { useTranslation } from 'react-i18next'
import { Image } from '~/components/Image'
import { Tag } from './Tag'
import { cn } from '@app/util/cn'
import { Link } from './localized-link'

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
        'relative flex flex-col bg-white text-black shadow-md transition-transform duration-200 ease-in-out',
        className,
      )}
    >
      <div
        className="p3 absolute -top-2.5 left-2 flex flex-col items-center bg-white/80 pb-4 uppercase leading-[1]"
        style={{ textShadow: '0px 0px 10px rgb(0 0 0 / 30%)' }}
      >
        <DateComponent date={event.date as string} className="" format="EEEEEE" />
        <DateComponent date={event.date as string} className="" format="MMM" />
        <DateComponent
          date={event.date as string}
          className="font-calendar text-4xl font-semibold"
          format="dd"
        />
        {isPast && <DateComponent date={event.date as string} format="yyyy" />}
      </div>
      <Link to={event.url ?? ''} prefetch="intent" className="contents">
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
      </Link>
      <div className="flex flex-col sm:aspect-[3/2]">
        <div className="hide-scrollbar m-[0.3em] flex min-h-6 flex-row-reverse overflow-x-auto">
          <div className="w-max shrink-0 space-x-2">
            {((event.series ?? []) as EventSery[]).map(
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
            date={event.date as string}
            className="font-medium text-red-500"
            format="p"
          />
          <Link to={event.url ?? ''} prefetch="intent" className="font-semibold uppercase">
            {event.title}
          </Link>
          <Link
            to={event.url ?? ''}
            prefetch="intent"
            className="flex flex-1 items-end text-sm uppercase text-gray-400"
          >
            {t('More Info')}
          </Link>
        </div>
      </div>
    </div>
  )
}

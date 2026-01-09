import React from 'react'
import type { Media, Event, EventSery } from '@app/types/payload'
import { Date as DateComponent } from '~/components/Date'
import { useTranslation } from 'react-i18next'
import { Image } from '~/components/Image'
import { Tag } from './Tag'
import { cn } from '@app/util/cn'
import { Link } from './localized-link'
import { getEventSubtitle } from '@app/util/data/getEventSubtitle'
import { ICSDownloadButton } from './ICSDownloadButton'

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
      <div className="absolute -top-2.5 left-2 flex flex-col items-center bg-white p-3 pb-4 leading-none text-gray-700 uppercase">
        <DateComponent date={event.date as string} format="EEEEEE" />
        <DateComponent date={event.date as string} format="MMM" />
        <DateComponent
          date={event.date as string}
          className="font-calendar text-4xl font-semibold text-black"
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
      <div className="flex max-w-full flex-col sm:aspect-[3/2]">
        <div className="flex min-h-6 flex-col items-end gap-y-[1.5px]">
          {((event.series ?? []) as EventSery[]).map(
            ({ id, name, slug }, index) =>
              activeEventSery?.id !== id && (
                <Link
                  key={index}
                  to={`/event-series/${slug}`}
                  prefetch="intent"
                  className="contents"
                >
                  <Tag className="inline" key={index}>
                    {name}
                  </Tag>
                </Link>
              ),
          )}
        </div>
        <div className="flex flex-1 flex-col gap-4 px-4 pb-4">
          <div className="flex items-center gap-2">
            <DateComponent
              date={event.date as string}
              className="font-medium text-red-500"
              format="p"
            />
            {event.date > new Date().toISOString() && (
              <ICSDownloadButton
                events={[event]}
                className="text-lg text-gray-300 text-red-500/30 transition-colors hover:text-red-500"
                showLabel={false}
              />
            )}
          </div>
          <Link to={event.url ?? ''} prefetch="intent" className="space-y-1">
            <h3 className="leading-tight font-semibold uppercase"> {event.title}</h3>
            <div className="text-sm text-gray-500">{getEventSubtitle({ event, t })}</div>
          </Link>
          <div className="text-sm leading-tight font-semibold tracking-tight text-balance">
            {event.comment}
          </div>
          <Link
            to={event.url ?? ''}
            prefetch="intent"
            className="flex flex-1 items-end text-sm text-gray-400 uppercase transition-colors hover:text-black"
          >
            {t('More Info')}
          </Link>
        </div>
      </div>
    </div>
  )
}

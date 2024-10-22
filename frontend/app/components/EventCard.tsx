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

export const EventCard: React.FC<Props> = ({ event, activeScreeningSery }) => {
  const { t } = useTranslation()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isPast = new Date(Date.parse(event.date)) < today
  return (
    <div className="relative flex flex-col bg-white text-black shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-2">
      <div
        className="p3 absolute -top-2.5 left-2 flex flex-col items-center bg-white/80 pb-4 uppercase leading-[1]"
        style={{ textShadow: '0px 0px 10px rgb(0 0 0 / 30%)' }}
      >
        <DateComponent iso={event.date as string} className="" format="EEEEEE" />
        <DateComponent iso={event.date as string} className="" format="MMM" />
        <DateComponent
          iso={event.date as string}
          className="font-calendar text-3xl font-semibold"
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
      <div className="flex aspect-[3/2] flex-col">
        <div className="m-[0.3em] flex min-h-6 items-center justify-end">
          {event.series && activeScreeningSery?.id !== (event.series as ScreeningSery)?.id && (
            <div className="bg-turquoise-500 inline-flex max-w-32 rounded-lg px-[0.5em] py-[0.2em] text-center text-sm font-semibold leading-none text-white">
              {(event.series as ScreeningSery).name}
            </div>
          )}
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

import type React from 'react'
import type { Country, FilmPrint, Media, Movie, Person } from '@app/types/payload'
import { useTranslation } from 'react-i18next'
import { Image } from '~/components/Image'
import { Icon } from '@iconify/react'
import arrow from '@iconify-icons/material-symbols/arrow-forward-ios-rounded'
import { RichText } from './RichText'

type Props = {
  item: Pick<FilmPrint, 'movie'>
}

export const FilmPrintCard: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation()
  const movie = item.movie as Movie

  return (
    <div className="grid grid-cols-1 bg-white text-black shadow-md transition-transform duration-200 hover:translate-y-[-7px] sm:grid-cols-2 lg:grid-cols-[auto_22rem]">
      <Image
        image={movie.still as Media}
        alt={t('movie still') as string}
        srcSet={[
          { options: { width: 500, height: 281, fit: 'crop' }, size: '500w' },
          { options: { width: 768, height: 432, fit: 'crop' }, size: '768w' },
          { options: { width: 1536, height: 864, fit: 'crop' }, size: '1536w' },
        ]}
        sizes="(max-width: 1200px) 66vw, (max-width: 1000px) 50vw, (max-width: 768px) 100vw, 768px"
        className="col-start-1 row-start-1 h-full w-full object-cover"
      />
      <div className="col-start-1 row-start-1 bg-[linear-gradient(180deg,#000000_-50%,#00000000_54%)] p-4 text-white">
        <div className="text-2xl font-semibold uppercase">{movie.title}</div>
        <div className="text-sm">
          <b>{((movie.directors as Person[]) || []).map((x) => x.name).join(', ')}</b>{' '}
          {((movie.countries as Country[]) || []).map((x) => x.name).join(', ')}
          {', '}
          {movie.year}
        </div>
      </div>
      <div className="grid grid-cols-1 grid-rows-[auto_min-content] gap-y-4 p-4 text-sm max-sm:aspect-[32/9]">
        <RichText
          className="prose prose-neutral relative overflow-hidden leading-normal after:absolute after:bottom-0 after:left-0 after:z-10 after:h-[5rem] after:w-full after:bg-[linear-gradient(transparent,#FFFFFF)] after:content-['_'] sm:h-[25vw] lg:h-[20em]"
          content={movie.synopsis}
        />
        <div className="flex items-center gap-1 justify-self-end text-xs font-medium uppercase text-neutral-200">
          {t('More Info')}
          <Icon icon={arrow} />
        </div>
      </div>
    </div>
  )
}

export const FilmPrintCardSkeleton: React.FC = () => (
  <div
    aria-hidden="true"
    className="grid animate-pulse grid-cols-1 bg-white shadow-md sm:grid-cols-2 lg:grid-cols-[auto_22rem]"
  >
    <div className="relative aspect-video bg-neutral-50 sm:aspect-auto sm:min-h-[25vw] lg:min-h-[20em]">
      <div className="absolute top-4 left-4 h-7 w-2/3 rounded bg-neutral-100" />
      <div className="absolute top-14 left-4 h-4 w-1/3 rounded bg-neutral-100" />
    </div>
    <div className="grid grid-rows-[minmax(0,1fr)_min-content] gap-y-4 p-4 max-sm:aspect-[32/9]">
      <div className="space-y-3 overflow-hidden sm:h-[25vw] lg:h-[20em]">
        <div className="h-3 rounded bg-neutral-100" />
        <div className="h-3 rounded bg-neutral-100" />
        <div className="h-3 w-4/5 rounded bg-neutral-100" />
      </div>
      <div className="h-4 w-20 justify-self-end rounded bg-neutral-100" />
    </div>
  </div>
)

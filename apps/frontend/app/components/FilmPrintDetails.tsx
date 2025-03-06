import type { FilmPrint, Movie as MovieType, Media, Rental } from '@app/types/payload'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Image } from '~/components/Image'
import { Button } from '~/components/Button'
import { AsideLayout } from './AsideLayout'
import { Poster } from './Poster'
import { useRootLoaderData } from '~/util/useRootLoaderData'
import { getMovieSpecsString } from '@app/util/data/getMovieSpecsString'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  filmPrint: FilmPrint
  isMainProgram?: boolean | null
  additionalInfo?: React.ReactNode
}

export const FilmPrintDetails: React.FC<Props> = ({
  filmPrint,
  isMainProgram = true,
  additionalInfo,
  ...props
}) => {
  const { t } = useTranslation()
  const rootLoaderData = useRootLoaderData()

  const rental = (filmPrint.isRented ? filmPrint.rental : rootLoaderData?.site?.defaultRental) as
    | Rental
    | undefined

  return (
    <AsideLayout {...props} aside={<Poster movie={filmPrint.movie as MovieType} />}>
      <div className="mb-4">
        <h2 className="break-words text-3xl font-semibold uppercase">
          {!isMainProgram && (
            <span className="mr-2 text-nowrap text-sm max-sm:block">{`${t('Supporting Film')}: `}</span>
          )}
          {((filmPrint as FilmPrint).movie as MovieType).title}
        </h2>
        <div className="text-sm text-neutral-200">
          {getMovieSpecsString({
            type: 'full',
            filmPrint: filmPrint,
            t,
          })}
        </div>
      </div>
      <p
        className="my-4"
        dangerouslySetInnerHTML={{
          __html: ((filmPrint as FilmPrint).movie as MovieType).synopsis as string,
        }}
      />
      {additionalInfo}
      {((filmPrint as FilmPrint).movie as MovieType).trailer && (
        <Link
          className="contents"
          to={((filmPrint as FilmPrint).movie as MovieType).trailer ?? ''}
          target="_blank"
        >
          <Button className="my-4 uppercase">
            {t('Trailer')} <span className="i-material-symbols:play-arrow text-lg" />
          </Button>
        </Link>
      )}
      {rental && (
        <div className="inline-block max-sm:text-sm">
          <div
            dangerouslySetInnerHTML={{
              __html: rental.credits as string,
            }}
          />
          {rental.logo && <Image className="my-2 h-12 w-auto" image={rental.logo as Media} />}
        </div>
      )}
    </AsideLayout>
  )
}

import type { FilmPrint, Movie as MovieType, Media, Rental, Movie } from '@app/types/payload'
import { useTranslation } from 'react-i18next'
import { Image } from '~/components/Image'
import { AsideLayout } from './AsideLayout'
import { Poster } from './Poster'
import { useRootLoaderData } from '~/util/useRootLoaderData'
import { getMovieSpecsString } from '@app/util/data/getMovieSpecsString'
import { TrailerButton } from './TrailerButton'
import { RichText } from './RichText'

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
    <AsideLayout
      {...props}
      aside={
        <div className="flex flex-col gap-4">
          <Poster movie={filmPrint.movie as MovieType} />
          <TrailerButton movie={filmPrint.movie as Movie} className="max-sm:hidden" />
        </div>
      }
    >
      <div className="mb-4">
        <h2 className="text-3xl font-semibold break-words uppercase">
          {!isMainProgram && (
            <span className="mr-2 text-sm text-nowrap max-sm:block">{`${t('Supporting Film')}: `}</span>
          )}
          {((filmPrint as FilmPrint).movie as MovieType).title}
        </h2>
        <div
          className="text-sm text-neutral-200"
          // avoid encoding issues
          dangerouslySetInnerHTML={{
            __html: getMovieSpecsString({
              type: 'full',
              filmPrint: filmPrint,
              t,
            }),
          }}
        ></div>
      </div>
      <RichText content={((filmPrint as FilmPrint).movie as MovieType).synopsis} className="my-4" />

      {additionalInfo}

      <TrailerButton movie={filmPrint.movie as Movie} className="my-4 sm:hidden" />
      {rental && (
        <p className="mt-4 inline-block max-sm:text-sm">
          {rental.credits}
          {rental.logo && <Image className="my-2 h-12 w-auto" image={rental.logo as Media} />}
        </p>
      )}
    </AsideLayout>
  )
}

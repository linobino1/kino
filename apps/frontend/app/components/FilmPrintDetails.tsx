import type { FilmPrint, Movie as MovieType, Media, Rental } from '@app/types/payload'
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next'
import { Image } from '~/components/Image'
import { movieSpecs } from '~/util/movieSpecs'
import { Button } from '~/components/Button'
import { AsideLayout } from './AsideLayout'
import { Poster } from './Poster'

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
          {movieSpecs({
            filmPrint: filmPrint,
            t,
          }).map((item, index) => (
            <span key={index}>
              {index > 0 && <span className="whitespace-pre">{' | '}</span>}
              {item}
            </span>
          ))}
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
      {((filmPrint as FilmPrint)?.rental as Rental) && (
        <div className="inline-block max-sm:text-sm">
          <div
            dangerouslySetInnerHTML={{
              __html: ((filmPrint as FilmPrint)?.rental as Rental).credits as string,
            }}
          />
          {((filmPrint as FilmPrint)?.rental as Rental)?.logo && (
            <Image
              className="my-2 h-12 w-auto"
              image={((filmPrint as FilmPrint)?.rental as Rental)?.logo as Media}
            />
          )}
        </div>
      )}
    </AsideLayout>
  )
}

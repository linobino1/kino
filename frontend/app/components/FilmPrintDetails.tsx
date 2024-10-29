import type { FilmPrint, Movie as MovieType, Media, Rental } from '@/payload-types'
import { Link } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import { Image } from '~/components/Image'
import { cn } from '~/util/cn'
import { movieSpecs } from '~/util/movieSpecs'
import { Button } from '~/components/Button'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  filmPrint: FilmPrint
  isSupportingFilm?: boolean
  additionalInfo?: React.ReactNode
}

const Poster = ({ filmprint, className }: { filmprint: FilmPrint; className?: string }) => (
  <Image
    className={cn('float-left mb-2 mr-4 h-auto w-[min(15em,50%)] md:w-[260px]', className)}
    image={(filmprint.movie as MovieType).poster as Media}
    alt="movie poster"
    srcSet={[
      { options: { width: 260 }, size: '260w' },
      { options: { width: 520 }, size: '520w' },
    ]}
    sizes="260px"
  />
)

export const FilmPrintDetails: React.FC<Props> = ({
  filmPrint,
  isSupportingFilm,
  additionalInfo,
  ...props
}) => {
  const { t } = useTranslation()
  return (
    <div {...props}>
      <Poster filmprint={filmPrint} className="max-sm:hidden" />
      <div className="mb-4">
        <h2 className="break-words text-3xl font-semibold uppercase">
          {isSupportingFilm && (
            <span className="mr-2 text-nowrap text-sm max-sm:block">{`${t('Supporting Film')}: `}</span>
          )}
          {((filmPrint as FilmPrint).movie as MovieType).title}
        </h2>
        <div className="text-sm text-neutral-200">
          {movieSpecs({
            filmPrint: filmPrint,
            movie: filmPrint.movie as MovieType,
            t,
          }).map((item, index) => (
            <span key={index}>
              {index > 0 && <span className="whitespace-pre">{' | '}</span>}
              {item}
            </span>
          ))}
        </div>
      </div>
      <Poster filmprint={filmPrint as FilmPrint} className="sm:hidden" />
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
    </div>
  )
}

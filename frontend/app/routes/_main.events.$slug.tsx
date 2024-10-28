import { type LoaderFunctionArgs, HeadersFunction } from '@remix-run/node'
import type {
  FilmPrint,
  Location,
  Media,
  Movie as MovieType,
  Rental,
  ScreeningSery,
  Season,
} from '@/payload-types'
import { type loader as rootLoader } from '~/root'
import { Link, MetaFunction, useLoaderData, useRouteLoaderData } from '@remix-run/react'
import { cacheControlShortWithSWR } from '~/util/cache-control/cacheControlShortWithSWR'
import { Locale } from 'shared/config'
import { getPayload } from '~/util/getPayload.server'
import i18next from '~/i18next.server'
import { PageLayout } from '~/components/PageLayout'
import { Hero } from '~/components/Hero'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import { useTranslation } from 'react-i18next'
import { formatInTimeZone } from 'date-fns-tz'
import { parseISO } from 'date-fns'
import { JsonLd } from '~/structured-data'
import { eventSchema } from '~/structured-data/screening'
import { Date } from '~/components/Date'
import Tag from '~/components/Tag'
import Image from '~/components/Image'
import { movieSpecs } from '~/util/movieSpecs'
import RichText from '~/components/RichText'
import Button from '~/components/Button'
import Gutter from '~/components/Gutter'
import { lexicalToPlainText } from '~/components/RichText/lexicalToPlainText'
import { cn } from '~/util/cn'
import { env } from '~/env.server'

export const headers: HeadersFunction = () => ({
  'Cache-Control': cacheControlShortWithSWR,
})

export const meta: MetaFunction<typeof loader> = ({ data, matches }) =>
  generateMetadata({
    ...data?.meta,
    env: getEnvFromMatches(matches),
  })

export const loader = async ({
  params: { lang: locale, slug },
  request: { url },
}: LoaderFunctionArgs) => {
  const payload = await getPayload()
  const [res, t] = await Promise.all([
    payload.find({
      collection: 'events',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 8,
      locale: locale as Locale,
    }),
    i18next.getFixedT(locale as string),
  ])

  const event = res.docs[0]

  if (!event) {
    throw new Error(t('error.404', { url }))
  }

  return {
    event,
    meta: {
      title: t('event.meta.title', {
        title: event.title,
        date: formatInTimeZone(parseISO(event?.date || ''), env.TIMEZONE, 'PPp'),
      }),
      description:
        event.type === 'event'
          ? lexicalToPlainText(event.info)
          : // description is more specific for screenings
            t('screening.meta.description', {
              date: formatInTimeZone(parseISO(event.date || ''), env.TIMEZONE, 'PPpp'),
              synopsis: ((event.films?.[0]?.filmprint as FilmPrint).movie as MovieType).synopsis,
            }),
      image: event.header,
    },
  }
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

export default function EventPage() {
  const { t } = useTranslation()
  const { event } = useLoaderData<typeof loader>()
  const site = useRouteLoaderData<typeof rootLoader>('root')?.site
  return (
    <PageLayout>
      {JsonLd(eventSchema(event, site))}
      <Hero type="overlay" headline={event.title} image={event.header}>
        <div className="leading-tight">
          <Date className="text-lg font-semibold" iso={event.date as string} format="P / p" />
          <br />
          <div className="text-lg">{(event.location as Location).name}</div>
          <Link to={(event.season as Season).url} prefetch="intent">
            {(event.season as Season).name}
          </Link>
          <div className="my-4 text-2xl font-semibold uppercase">{event.title}</div>
          {event.series && (
            <a
              href={`/screening-series/${(event.series as ScreeningSery).slug}`}
              className="contents"
            >
              <Tag>{(event.series as ScreeningSery)?.name}</Tag>
            </a>
          )}
        </div>
      </Hero>

      {event.info && (
        <Gutter>
          <RichText content={event.info} className="" />{' '}
        </Gutter>
      )}

      {/* TODO: here we should just iterate all the program items and render them */}
      <Gutter className="flex flex-col gap-4">
        {event.type === 'screening' &&
          event.films?.map(({ filmprint, isSupportingFilm, info }, index) => (
            <div key={index} className="my-4">
              {index > 0 && <hr className="mb-8" />}
              <Poster filmprint={filmprint as FilmPrint} className="max-sm:hidden" />
              <div className="mb-4">
                <h2 className="break-words text-3xl font-semibold uppercase">
                  {isSupportingFilm && (
                    <span className="mr-2 text-nowrap text-sm max-sm:block">{`${t('Supporting Film')}: `}</span>
                  )}
                  {((filmprint as FilmPrint).movie as MovieType).title}
                </h2>
                <div className="text-sm text-neutral-200">
                  {movieSpecs({
                    filmPrint: filmprint as FilmPrint,
                    movie: (filmprint as FilmPrint).movie as MovieType,
                    t,
                  }).map((item, index) => (
                    <span key={index}>
                      {index > 0 && <span className="whitespace-pre">{' | '}</span>}
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <Poster filmprint={filmprint as FilmPrint} className="sm:hidden" />
              <p
                className="my-4"
                dangerouslySetInnerHTML={{
                  __html: ((filmprint as FilmPrint).movie as MovieType).synopsis as string,
                }}
              />
              {info && <RichText content={info} className="my-4" />}
              {((filmprint as FilmPrint).movie as MovieType).trailer && (
                <Link
                  className="contents"
                  to={((filmprint as FilmPrint).movie as MovieType).trailer ?? ''}
                  target="_blank"
                >
                  <Button className="my-4 uppercase">
                    {t('Trailer')} <span className="i-material-symbols:play-arrow text-lg" />
                  </Button>
                </Link>
              )}
              {((filmprint as FilmPrint)?.rental as Rental) && (
                <div className="inline-block max-sm:text-sm">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: ((filmprint as FilmPrint)?.rental as Rental).credits as string,
                    }}
                  />
                  {((filmprint as FilmPrint)?.rental as Rental)?.logo && (
                    <Image
                      className="my-2 h-12 w-auto"
                      image={((filmprint as FilmPrint)?.rental as Rental)?.logo as Media}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        {event.type === 'event' && <div className="">non-screening event</div>}
      </Gutter>

      <div className="h-8" />
    </PageLayout>
  )
}

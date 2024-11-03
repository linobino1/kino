import { type LoaderFunctionArgs, HeadersFunction } from '@remix-run/node'
import type {
  FilmPrint,
  Location,
  Movie as MovieType,
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
import { formatInTimeZone } from 'date-fns-tz'
import { parseISO } from 'date-fns'
import { JsonLd } from '~/structured-data'
import { eventSchema } from '~/structured-data/screening'
import { Date } from '~/components/Date'
import Tag from '~/components/Tag'
import RichText from '~/components/RichText'
import Gutter from '~/components/Gutter'
import { lexicalToPlainText } from '~/components/RichText/lexicalToPlainText'
import { env } from '~/env.server'
import { FilmPrintDetails } from '~/components/FilmPrintDetails'
import React from 'react'
import ErrorPage from '~/components/ErrorPage'

export const ErrorBoundary = ErrorPage

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
    throw new Response(t('error.404', { url }), { status: 404 })
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

export default function EventPage() {
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
            <React.Fragment key={index}>
              {index > 0 && <hr className="mb-4" />}
              <FilmPrintDetails
                filmPrint={filmprint as FilmPrint}
                isSupportingFilm={!!isSupportingFilm}
                additionalInfo={<RichText content={info} className="my-4" />}
                className="my-4"
              />
            </React.Fragment>
          ))}
        {event.type === 'event' && <div className="">non-screening event</div>}
      </Gutter>

      <div className="h-8" />
    </PageLayout>
  )
}

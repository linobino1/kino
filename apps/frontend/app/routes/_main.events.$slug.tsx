import { type LoaderFunctionArgs } from '@remix-run/node'
import type { FilmPrint, Location, Media, ScreeningSery, Season } from '@app/types/payload'
import { type loader as rootLoader } from '~/root'
import type { MetaFunction } from '@remix-run/react'
import { Link, useLoaderData, useRouteLoaderData } from '@remix-run/react'
import type { Locale } from '@app/i18n'
import { getPayload } from '~/util/getPayload.server'
import i18next from '~/i18next.server'
import { PageLayout } from '~/components/PageLayout'
import { Hero } from '~/components/Hero'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import { formatInTimeZone } from 'date-fns-tz'
import { parseISO } from 'date-fns'
import { JsonLd } from '~/structured-data'
import { eventSchema } from '~/structured-data/event'
import { Date } from '~/components/Date'
import Tag from '~/components/Tag'
import RichText from '~/components/RichText'
import Gutter from '~/components/Gutter'
import { env } from '@app/util/env/frontend.server'
import { FilmPrintDetails } from '~/components/FilmPrintDetails'
import React from 'react'
import ErrorPage from '~/components/ErrorPage'
import { AsideLayout } from '~/components/AsideLayout'
import { Poster } from '~/components/Poster'

export const ErrorBoundary = ErrorPage

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
      description: t('event.meta.description', {
        date: formatInTimeZone(parseISO(event.date || ''), env.TIMEZONE, 'PPpp'),
        location: (event.location as Location).name,
        info: event.shortDescription,
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
          <Link to={(event.season as Season).url ?? ''} prefetch="intent">
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

      {event.intro && (
        <Gutter>
          <RichText content={event.intro} />
        </Gutter>
      )}

      <Gutter className="my-4 flex flex-col gap-4">
        {event.programItems?.map(({ type, isMainProgram, info, filmPrint, poster }, index) => (
          <React.Fragment key={index}>
            {index > 0 && <hr className="my-4" />}
            {type === 'screening' ? (
              <FilmPrintDetails
                filmPrint={filmPrint as FilmPrint}
                isMainProgram={isMainProgram}
                additionalInfo={<RichText content={info} />}
              />
            ) : (
              <AsideLayout aside={poster && <Poster image={poster as Media} />}>
                <RichText content={info} enableMarginBlock={false} />
              </AsideLayout>
            )}
          </React.Fragment>
        ))}
      </Gutter>
    </PageLayout>
  )
}

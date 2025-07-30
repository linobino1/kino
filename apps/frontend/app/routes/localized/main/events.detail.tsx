import type { Route } from './+types/events.detail'
import type { FilmPrint, Location, Media, EventSery, Season } from '@app/types/payload'
import type { loader as rootLoader } from '~/root'
import type { Locale } from '@app/i18n'
import { Link } from '~/components/localized-link'
import { useRouteLoaderData } from 'react-router'
import { getPayload } from '~/util/getPayload.server'
import i18next from '~/i18next.server'
import { PageLayout } from '~/components/PageLayout'
import { Hero } from '~/components/Hero'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import { JsonLd } from '~/structured-data'
import { eventSchema } from '~/structured-data/event'
import { Date as DateComponent } from '~/components/Date'
import { Tag } from '~/components/Tag'
import { RichText } from '~/components/RichText'
import { Gutter } from '~/components/Gutter'
import { FilmPrintDetails } from '~/components/FilmPrintDetails'
import React from 'react'
import { AsideLayout } from '~/components/AsideLayout'
import { Poster } from '~/components/Poster'
import { useTranslation } from 'react-i18next'
import { Image } from '~/components/Image'
import { ICSDownloadButton } from '~/components/ICSDownloadButton'
import { formatDate } from '@app/util/formatDate'

export const meta: Route.MetaFunction = ({ data, matches }) =>
  generateMetadata({
    ...data?.meta,
    env: getEnvFromMatches(matches),
  })

export const loader = async ({
  params: { lang: locale, slug },
  request: { url },
}: Route.LoaderArgs) => {
  // throw new Error('Not implemented')
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
    throw new Response(t('error.404', { url, interpolation: { escapeValue: false } }), {
      status: 404,
    })
  }

  return {
    event,
    meta: {
      title: t('event.meta.title', {
        title: event.title,
        date: formatDate(event.date, 'PPp', locale as Locale),
      }),
      description: t('event.meta.description', {
        date: formatDate(event.date, 'PPp', locale as Locale),
        location: (event.location as Location).name,
        info: event.shortDescription,
      }),
      image: event.header,
    },
  }
}

export default function EventPage({ loaderData: { event } }: Route.ComponentProps) {
  const site = useRouteLoaderData<typeof rootLoader>('root')?.site
  const { t } = useTranslation()
  const structuredData = eventSchema(event, site)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isUpcoming = event.date > today.toISOString()

  return (
    <PageLayout>
      {structuredData && <JsonLd {...structuredData} />}
      <Hero type="overlay" headline={event.title} image={event.header}>
        <div className="leading-tight">
          <div className="flex items-center gap-4">
            <DateComponent
              className="text-lg font-semibold"
              date={event.date as string}
              format="P / p"
            />
            {isUpcoming && <ICSDownloadButton events={[event]} showLabel={false} />}
          </div>
          <br />
          <div className="text-lg">{(event.location as Location).name}</div>
          <Link to={(event.season as Season).url ?? ''} prefetch="intent">
            {(event.season as Season).name}
          </Link>
          <div className="mt-4 text-2xl font-semibold uppercase sm:text-3xl">{event.title}</div>
          {event.series?.length ? (
            <div className="my-1 flex gap-2">
              {((event.series ?? []) as EventSery[]).map(({ slug, name }, index) => (
                <Link key={index} className="contents" to={`/event-series/${slug}`}>
                  <Tag>{name}</Tag>
                </Link>
              ))}
            </div>
          ) : null}
          {event.subtitle && <p className="text-lg">{event.subtitle}</p>}
          {event.comment && <p className="mt-3 font-semibold">{event.comment}</p>}
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

      {event.partnerLogos?.length && (
        <Gutter className="text-center">
          <hr className="my-4" />
          <h3 className="font-xl my-8">{t('event.page.partners')}</h3>
          <div className="flex justify-center gap-4">
            {event.partnerLogos.map((logo, index) => (
              <Image key={index} className="h-24 w-48 object-contain" image={logo as Media} />
            ))}
          </div>
        </Gutter>
      )}
    </PageLayout>
  )
}

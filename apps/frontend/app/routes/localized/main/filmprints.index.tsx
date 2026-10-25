import type { Route } from './+types/filmprints.index'
import type { Locale } from '@app/i18n'
import type { Where } from 'payload'
import { redirect } from 'react-router'
import { Form, useLocation, useNavigate, useNavigation, useSearchParams } from 'react-router'
import { getPayload } from '~/util/getPayload.server'
import { getInstance } from '~/middleware/i18next'
import { PageLayout } from '~/components/PageLayout'
import { Hero } from '~/components/Hero'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import { Pagination } from '~/components/Pagination'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import { Filters } from '~/util/filter'
import { FilmPrintCard, FilmPrintCardSkeleton } from '~/components/FilmPrintCard'
import { Button } from '~/components/Button'
import { Gutter } from '~/components/Gutter'
import { RenderBlocks } from '~/components/Blocks/RenderBlocks'
import { Link } from '~/components/localized-link'
import { Icon } from '@iconify/react'
import arrow from '@iconify-icons/material-symbols/arrow-forward-ios-rounded'
import { measureServerTiming } from '~/util/serverTiming.server'

const limit = 20

export const meta: Route.MetaFunction = ({ loaderData, matches }) =>
  generateMetadata({
    title: loaderData?.page.meta?.title,
    description: loaderData?.page.meta?.description,
    image: loaderData?.page.meta?.image,
    env: getEnvFromMatches(matches),
  })

export const loader = async ({
  request,
  params: { lang: locale },
  url,
  context,
}: Route.LoaderArgs) => {
  const { t } = getInstance(context)
  const payload = await getPayload()
  const params = new URL(url).searchParams
  const pageNumber = parseInt(params.get('page') || '1')
  const query = params.get('query') || ''

  // this route is used for both the filmprints page and the hfg-archive page, so we need to check which one it is
  const isHfgArchivePage = url.pathname.includes('hfg-archive')
  if (isHfgArchivePage) {
    params.set('movie.isHfgProduction', 'true')
  }

  const filters = getFilters({ params })
  const [pages, filmPrints, facetDocs] = await Promise.all([
    measureServerTiming(request, 'filmprints.page', () =>
      payload.find({
        collection: 'pages',
        select: {
          layoutType: true,
          hero: {
            type: true,
            headline: true,
            image: true,
          },
          meta: {
            title: true,
            description: true,
            image: true,
          },
          blocks: true,
        },
        where: {
          slug: {
            equals: isHfgArchivePage ? 'hfg-archive' : 'filmprints',
          },
        },
        depth: 1,
        locale: locale as Locale,
      }),
    ),
    measureServerTiming(request, 'filmprints.list', () =>
      payload.find({
        collection: 'filmPrints',
        locale: locale as Locale,
        select: {
          slug: true,
          movie: true,
        },
        populate: {
          movies: {
            title: true,
            still: true,
            synopsis: true,
            year: true,
            directors: true,
            countries: true,
          },
          media: {
            filename: true,
            url: true,
            alt: true,
            width: true,
            height: true,
            focalX: true,
            focalY: true,
          },
          persons: {
            name: true,
          },
          countries: {
            name: true,
          },
        },
        depth: 2,
        limit,
        page: pageNumber,
        where: filters.getWhereClause(),
      }),
    ),
    measureServerTiming(request, 'filmprints.facet-data', () =>
      payload.find({
        collection: 'filmPrints',
        locale: locale as Locale,
        where: filters.getGlobalWhereClause(),
        select: {
          languageVersion: true,
          format: true,
          movie: true,
          color: true,
        },
        populate: {
          languageVersions: {
            name: true,
          },
          formats: {
            name: true,
          },
          movies: {
            year: true,
            isHfgProduction: true,
            genres: true,
            countries: true,
            directors: true,
          },
          colors: {
            name: true,
          },
          genres: {
            name: true,
          },
          countries: {
            id: true,
          },
          persons: {
            name: true,
          },
        },
        depth: 2,
        limit: 0,
        pagination: false,
      }),
    ),
  ])

  const page = pages.docs[0]

  if (!page) {
    throw new Response(t('error.404', { url, interpolation: { escapeValue: false } }), {
      status: 404,
    })
  }

  // Redirect to the last page if the requested page is greater than the total number of pages.
  if (pageNumber > filmPrints.totalPages) {
    throw redirect(`?page=${filmPrints.totalPages}`, {
      status: 302,
    })
  }

  const appliedFilters = await measureServerTiming(request, 'filmprints.filters', async () =>
    filters.getApplied(facetDocs.docs),
  )

  return {
    page,
    query,
    filters: appliedFilters,
    filmPrints,
    isHfgArchivePage,
  }
}

const getFilters = ({ params }: { params?: URLSearchParams }): Filters => {
  const query = params && params.get('query')
  const queryClause: Where | undefined = query
    ? {
        or: [
          {
            'movie.internationalTitle': {
              contains: query,
            },
          },
          {
            'movie.originalTitle': {
              contains: query,
            },
          },
          {
            'movie.title': {
              contains: query,
            },
          },
          {
            'movie.directors.name': {
              contains: query,
            },
          },
          {
            'movie.cast.name': {
              contains: query,
            },
          },
          {
            'movie.crew.person.name': {
              contains: query,
            },
          },
          {
            'movie.synopsis': {
              contains: query,
            },
          },
          {
            'movie.tags': {
              contains: query,
            },
          },
        ],
      }
    : undefined
  const globalCause: Where | undefined = {
    and: [
      {
        isRented: {
          equals: false,
        },
      },
      {
        _status: {
          equals: 'published',
        },
      },
      queryClause || {},
    ],
  }
  const filters = new Filters({
    filters: [
      {
        name: 'languageVersion.name',
        label: 'filter.languageVersion',
      },
      {
        name: 'format.name',
        label: 'filter.format',
      },
      {
        name: 'movie.genres.name',
        label: 'filter.genre',
      },
      {
        name: 'color.name',
        label: 'filter.color',
      },
      {
        name: 'movie.countries.id',
        label: 'filter.countries',
      },
      {
        name: 'movie.decade',
        label: 'filter.decade',
        type: 'number',
        getValue: (item) =>
          typeof item.movie?.year === 'number' ? Math.floor(item.movie.year / 10) * 10 : undefined,
        where: (value: any) =>
          typeof value === 'number'
            ? {
                and: [
                  {
                    'movie.year': {
                      greater_than_equal: value,
                    },
                  },
                  {
                    'movie.year': {
                      less_than: value + 10,
                    },
                  },
                ],
              }
            : {
                and: [],
              },
      },
      {
        name: 'movie.isHfgProduction',
        label: 'filter.isHfgProduction.label',
        labelTrue: 'filter.isHfgProduction.true',
        labelFalse: 'filter.isHfgProduction.false',
      },
      {
        name: 'movie.directors.name',
        label: 'filter.directors',
      },
    ],
    globalCause,
  })
  filters.applySearchParams(params)
  return filters
}

export default function FilmprintsPage({
  loaderData: { filmPrints, filters, query, page, isHfgArchivePage },
}: Route.ComponentProps) {
  const { t } = useTranslation()
  const form = useRef<HTMLFormElement>(null)
  const location = useLocation()
  const navigation = useNavigation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const isLoadingList =
    navigation.state !== 'idle' && navigation.location?.pathname === location.pathname

  const resetFilters = () => {
    filters.forEach((filter) => {
      params.delete(filter.name)
    })
    params.delete('page')
    navigate(`?${params.toString()}`)
  }

  return (
    <PageLayout type={page.layoutType}>
      <Hero {...page.hero} />
      {page.blocks && <RenderBlocks blocks={page.blocks} />}
      <Form
        ref={form}
        method="GET"
        className="mx-auto my-[3vw] flex max-w-[min(100%,30rem)] grid-cols-2 flex-col gap-4 sm:grid"
      >
        <div className="relative sm:col-span-2">
          <input
            type="search"
            name="query"
            defaultValue={query}
            placeholder={t('search...') || ''}
            className="w-full rounded-full border border-gray-300 bg-white px-2 py-1 text-neutral-700"
          />
          <button
            type="submit"
            className="bg-theme-500 hover:bg-theme-600 absolute top-0 right-0 bottom-0 flex aspect-square cursor-pointer items-center justify-center rounded-r-full border-1 border-neutral-200 text-white"
          >
            <Icon icon={arrow} />
          </button>
        </div>
        {filters
          // on the hfg-archive page, we hide the isHfgProduction filter
          .filter((item) => (isHfgArchivePage ? item.name !== 'movie.isHfgProduction' : true))
          .map((filter) => (
            <select
              key={filter.name}
              name={filter.name}
              onChange={() => form.current?.requestSubmit()}
              value={filter.value || ''}
              className="min-h-[29px] rounded-full border-1 border-r-8 border-neutral-100 bg-neutral-100 px-2 py-1 text-xs text-black"
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>{`${t(
                  // @ts-expect-error option.label is not typed as a translation key
                  option.label ?? '',
                )} (${option.count})`}</option>
              ))}
            </select>
          ))}
        <Button
          size="sm"
          type="button"
          className="mx-auto mt-2 sm:col-span-2"
          onClick={resetFilters}
        >
          {t('reset filters')}
        </Button>
      </Form>
      <Gutter>
        {isLoadingList ? (
          <div role="status" aria-live="polite" className="mt-8 flex flex-col gap-8">
            <span className="sr-only">{t('Loading...')}</span>
            {Array.from({ length: Math.min(Math.max(filmPrints.docs.length, 3), limit) }).map(
              (_, index) => (
                <FilmPrintCardSkeleton key={index} />
              ),
            )}
          </div>
        ) : filmPrints.docs.length ? (
          <ul className="mt-8 flex flex-col gap-8">
            {filmPrints.docs.map((item) => (
              <li key={item.id}>
                <Link to={`${item.slug}`} prefetch="intent">
                  <FilmPrintCard item={item} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center">{t('No films matching your search')}</div>
        )}
      </Gutter>
      <Pagination {...filmPrints} linkProps={{ prefetch: 'intent' }} className="mt-8" />
    </PageLayout>
  )
}

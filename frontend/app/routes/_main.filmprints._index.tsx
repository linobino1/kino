import { type LoaderFunctionArgs, HeadersFunction, redirect } from '@remix-run/node'
import {
  Form,
  Link,
  MetaFunction,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react'
import { cacheControlShortWithSWR } from '~/util/cache-control/cacheControlShortWithSWR'
import { Locale } from 'shared/config'
import { getPayload } from '~/util/getPayload.server'
import i18next from '~/i18next.server'
import { PageLayout } from '~/components/PageLayout'
import { Hero } from '~/components/Hero'
import { generateMetadata } from '~/util/generateMetadata'
import { getEnvFromMatches } from '~/util/getEnvFromMatches'
import { classes } from '~/classes'
import Pagination from '~/components/Pagination'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import { Payload, Where } from 'payload'
import { Filters } from '~/util/filter'
import { FilmPrintCard } from '~/components/FilmPrintCard'
import { Button } from '~/components/Button'
import { Gutter } from '~/components/Gutter'
import ErrorPage from '~/components/ErrorPage'

const limit = 20

export const ErrorBoundary = ErrorPage

export const headers: HeadersFunction = () => ({
  'Cache-Control': cacheControlShortWithSWR,
})

export const meta: MetaFunction<typeof loader> = ({ data, matches }) =>
  generateMetadata({
    title: data?.page.meta?.title,
    description: data?.page.meta?.description,
    image: data?.page.meta?.image,
    env: getEnvFromMatches(matches),
  })

export const loader = async ({
  params: { lang: locale },
  request: { url },
}: LoaderFunctionArgs) => {
  const params = new URL(url).searchParams
  const pageNumber = parseInt(params.get('page') || '1')
  const query = params.get('query') || ''
  const [payload, t] = await Promise.all([getPayload(), i18next.getFixedT(locale as string)])

  // Get today's date at midnight
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'filmprints',
      },
    },
    locale: locale as Locale,
  })

  const page = pages.docs[0]

  if (!page) {
    throw new Error(t('error.404', { url }))
  }

  // get all published film prints
  const filters = getFilters({
    payload,
    locale: locale as string,
    params,
  })
  filters.applySearchParams(params)
  const filmPrints = await payload.find({
    collection: 'filmPrints',
    locale: locale as Locale,
    depth: 7,
    limit,
    page: pageNumber,
    where: filters.getWhereClause(),
  })

  // Redirect to the last page if the requested page is greater than the total number of page
  if (pageNumber > filmPrints.totalPages) {
    throw redirect(`?page=${filmPrints.totalPages}`, {
      status: 302,
    })
  }

  return {
    page,
    query,
    filters: await filters.getApplied(),
    filmPrints,
  }
}

const getFilters = ({
  payload,
  locale,
  params,
}: {
  payload: Payload
  locale: string
  params?: URLSearchParams
}): Filters => {
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
    collection: 'filmPrints',
    payload,
    locale: locale as Locale,
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
        label: 'filter.isHfgProduction',
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

export default function FilmprintsPage() {
  const data = useLoaderData<typeof loader>()
  const { page } = data
  const { filmPrints, filters, query } = data
  const { t } = useTranslation()
  const form = useRef<HTMLFormElement>(null)
  const navigate = useNavigate()
  const [params] = useSearchParams()

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
            className="w-full rounded-full border border-gray-300 px-2 py-1"
          />
          <button
            onClick={() => form.current?.submit()}
            className="bg-theme-500 border-1 hover:bg-theme-600 absolute bottom-0 right-0 top-0 flex aspect-square items-center justify-center rounded-r-full border-neutral-200 text-white"
          >
            <span className="i-material-symbols:arrow-forward-ios-rounded" />
          </button>
        </div>
        {filters.map((filter, index) => (
          <select
            key={index}
            name={filter.name}
            onChange={() => form.current?.submit()}
            value={filter.value || ''}
            className="border-1 rounded-full border-r-8 bg-neutral-100 px-2 py-1 text-xs text-black"
          >
            {filter.options.map((option, j) => (
              <option key={j} value={option.value}>{`${t(
                option.label || '',
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
        {filmPrints.docs.length ? (
          <ul className="mt-8 flex flex-col gap-8">
            {filmPrints.docs.map((item, index) => (
              <li key={index}>
                <Link key={item.id} to={`${item.slug}`} prefetch="intent">
                  <FilmPrintCard item={item} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className={classes.empty}>{t('No films matching your search.')}</div>
        )}
      </Gutter>
      <Pagination {...filmPrints} linkProps={{ prefetch: 'intent' }} className="mt-8" />
    </PageLayout>
  )
}

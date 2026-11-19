/** Route patterns shared by the frontend router and server-side URL consumers. */
export const localizedRoutePrefix = '/:lang?' as const

export const routePaths = {
  page: '/:slug',
  events: '/events',
  event: '/events/:slug',
  news: '/news',
  post: '/news/:slug',
  filmPrints: '/filmprints',
  filmPrint: '/filmprints/:slug',
  seasons: '/seasons',
  season: '/seasons/:slug',
  eventSeries: '/event-series/:slug',
  hfgArchive: '/hfg-archive',
  hfgArchiveFilmPrint: '/hfg-archive/:slug',
} as const

const withOptionalLocale = <Path extends string>(path: Path): `${typeof localizedRoutePrefix}${Path}` =>
  `${localizedRoutePrefix}${path}` as `${typeof localizedRoutePrefix}${Path}`

/** Full route patterns from the generated React Router route tree, for href(). */
export const typedRoutePaths = {
  home: localizedRoutePrefix,
  page: withOptionalLocale(routePaths.page),
  events: withOptionalLocale(routePaths.events),
  event: withOptionalLocale(routePaths.event),
  news: withOptionalLocale(routePaths.news),
  post: withOptionalLocale(routePaths.post),
  filmPrints: withOptionalLocale(routePaths.filmPrints),
  filmPrint: withOptionalLocale(routePaths.filmPrint),
  seasons: withOptionalLocale(routePaths.seasons),
  season: withOptionalLocale(routePaths.season),
  eventSeries: withOptionalLocale(routePaths.eventSeries),
  hfgArchive: withOptionalLocale(routePaths.hfgArchive),
  hfgArchiveFilmPrint: withOptionalLocale(routePaths.hfgArchiveFilmPrint),
} as const

type RouteParams = Record<string, string>

const buildPath = (pattern: string, params: RouteParams): string =>
  pattern.replace(/:([A-Za-z0-9_]+)/g, (_, key: string) => encodeURIComponent(params[key] ?? ''))

export const pagePath = (slug?: string | null): string =>
  slug === 'home' ? '/' : slug ? buildPath(routePaths.page, { slug }) : ''

export const postPath = (slug?: string | null): string =>
  slug ? buildPath(routePaths.post, { slug }) : ''

export const eventPath = (slug?: string | null): string =>
  slug ? buildPath(routePaths.event, { slug }) : ''

export const filmPrintPath = (slug?: string | null): string =>
  slug ? buildPath(routePaths.filmPrint, { slug }) : ''

export const seasonPath = (slug?: string | null): string =>
  slug ? buildPath(routePaths.season, { slug }) : ''

export const eventSeriesPath = (slug?: string | null): string =>
  slug ? buildPath(routePaths.eventSeries, { slug }) : ''

export const hfgArchiveFilmPrintPath = (slug?: string | null): string =>
  slug ? buildPath(routePaths.hfgArchiveFilmPrint, { slug }) : ''

const linkablePaths = {
  posts: postPath,
  pages: pagePath,
  events: eventPath,
  eventSeries: eventSeriesPath,
  filmPrints: filmPrintPath,
  seasons: seasonPath,
} as const

export type LinkableCollectionSlug = keyof typeof linkablePaths

export const linkableCollectionSlugs = Object.keys(linkablePaths) as LinkableCollectionSlug[]

export const linkableDocumentPath = (collection: string, slug?: string | null): string =>
  collection in linkablePaths
    ? linkablePaths[collection as LinkableCollectionSlug](slug)
    : ''

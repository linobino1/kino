import { href } from 'react-router'
import { typedRoutePaths, type LinkableCollectionSlug } from '@app/util/routes'

export const pageHref = (slug?: string | null) =>
  slug === 'home' ? href(typedRoutePaths.home) : slug ? href(typedRoutePaths.page, { slug }) : ''

export const postHref = (slug?: string | null) => (slug ? href(typedRoutePaths.post, { slug }) : '')

export const eventHref = (slug?: string | null) => (slug ? href(typedRoutePaths.event, { slug }) : '')

export const filmPrintHref = (slug?: string | null) =>
  slug ? href(typedRoutePaths.filmPrint, { slug }) : ''

export const seasonHref = (slug?: string | null) =>
  slug ? href(typedRoutePaths.season, { slug }) : ''

export const eventSeriesHref = (slug?: string | null) =>
  slug ? href(typedRoutePaths.eventSeries, { slug }) : ''

export const linkableDocumentHref = (collection: LinkableCollectionSlug, slug?: string | null) => {
  switch (collection) {
    case 'pages':
      return pageHref(slug)
    case 'posts':
      return postHref(slug)
    case 'events':
      return eventHref(slug)
    case 'eventSeries':
      return eventSeriesHref(slug)
    case 'filmPrints':
      return filmPrintHref(slug)
    case 'seasons':
      return seasonHref(slug)
  }
}

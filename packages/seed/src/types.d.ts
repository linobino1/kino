import type { Media, Movie, Page } from '@app/types/payload'
import type { GlobalSlug, Payload, RequiredDataFromCollectionSlug } from 'payload'
import type { CollectionSlug, RequiredDataFromCollection, DataFromGlobalSlug } from 'payload'

export type MediaMap = Map<string, RequiredDataFromCollection<Media>>

export type PagesMap = Map<string, RequiredDataFromCollection<Page>>

export type MoviesMap = Map<string, RequiredDataFromCollection<Movie>>

export type SeedContext = {
  payload: Payload
  media: MediaMap
  pages: PagesMap
  movies: MoviesMap
  aspectRatios: Map<string, RequiredDataFromCollectionSlug<'aspectRatios'>>
  colors: Map<string, RequiredDataFromCollectionSlug<'colors'>>
  formats: Map<string, RequiredDataFromCollectionSlug<'formats'>>
  carriers: Map<string, RequiredDataFromCollectionSlug<'carriers'>>
  soundFormats: Map<string, RequiredDataFromCollectionSlug<'soundFormats'>>
  languageVersions: Map<string, RequiredDataFromCollectionSlug<'languageVersions'>>
  conditions: Map<string, RequiredDataFromCollectionSlug<'conditions'>>
  seasons: Map<string, RequiredDataFromCollectionSlug<'seasons'>>
  genres: Map<string, RequiredDataFromCollectionSlug<'genres'>>
  locations: Map<string, RequiredDataFromCollectionSlug<'locations'>>
  rentals: Map<string, RequiredDataFromCollectionSlug<'rentals'>>
  categories: Map<string, RequiredDataFromCollectionSlug<'categories'>>
  eventSeries: Map<string, RequiredDataFromCollectionSlug<'eventSeries'>>
  filmPrints: Map<string, RequiredDataFromCollectionSlug<'filmPrints'>>
}

export type DocGenerator<T extends CollectionSlug> = (args: {
  context: SeedContext
  locale: Locale
}) => RequiredDataFromCollectionSlug<T>

export type RequiredDataFromGlobalSlug<T extends GlobalSlug> = Omit<DataFromGlobalSlug<T>, 'id'>

export type GlobalGenerator<T extends GlobalSlug> = (args: {
  context: SeedContext
  locale: Locale
}) => RequiredDataFromGlobalSlug<T>

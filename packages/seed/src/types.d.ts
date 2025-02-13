import type {
  AspectRatio,
  Carrier,
  Category,
  Color,
  Condition,
  Event,
  EventSery,
  FilmPrint,
  Format,
  Genre,
  LanguageVersion,
  Location,
  Media,
  Movie,
  Page,
  Rental,
  Season,
  SoundFormat,
} from '@app/types/payload'
import type { GlobalSlug, Payload, RequiredDataFromCollectionSlug } from 'payload'
import type { CollectionSlug, DataFromGlobalSlug } from 'payload'

export type SeedContext = {
  payload: Payload
  media: Map<string, Media>
  pages: Map<string, Page>
  movies: Map<string, Movie>
  aspectRatios: Map<string, AspectRatio>
  colors: Map<string, Color>
  formats: Map<string, Format>
  carriers: Map<string, Carrier>
  soundFormats: Map<string, SoundFormat>
  languageVersions: Map<string, LanguageVersion>
  conditions: Map<string, Condition>
  seasons: Map<string, Season>
  genres: Map<string, Genre>
  locations: Map<string, Location>
  rentals: Map<string, Rental>
  categories: Map<string, Category>
  events: Map<string, Event>
  eventSeries: Map<string, EventSery>
  filmPrints: Map<string, FilmPrint>
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

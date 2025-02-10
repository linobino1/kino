import type { Payload } from 'payload'
import type { SeedContext } from '../types'

export const initContext = (payload: Payload): SeedContext => ({
  payload,
  media: new Map(),
  pages: new Map(),
  movies: new Map(),
  aspectRatios: new Map(),
  colors: new Map(),
  formats: new Map(),
  carriers: new Map(),
  soundFormats: new Map(),
  languageVersions: new Map(),
  conditions: new Map(),
  seasons: new Map(),
  genres: new Map(),
  locations: new Map(),
  rentals: new Map(),
  categories: new Map(),
  eventSeries: new Map(),
  filmPrints: new Map(),
})

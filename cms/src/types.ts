// manually created types go here
import type { Post, StaticPage, Event, ScreeningSery, FilmPrint, Season } from '@/payload-types'
import { CollectionSlug } from 'payload'

// each collection that has a url field must be added to this type
export type LinkableCollection = Post | StaticPage | Event | ScreeningSery | FilmPrint | Season

// each collection that has a url field must be added to this array
export const LinkableCollectionSlugs: CollectionSlug[] = [
  'posts',
  'staticPages',
  'events',
  'screeningSeries',
  'filmPrints',
  'seasons',
]

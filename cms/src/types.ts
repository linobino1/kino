// manually created types go here
import type { Post, Event, ScreeningSery, FilmPrint, Season, Page } from '@/payload-types'
import { CollectionSlug } from 'payload'

// each collection that has a url field must be added to this type
export type LinkableCollection = Post | Page | Event | ScreeningSery | FilmPrint | Season

// each collection that has a url field must be added to this array
export const LinkableCollectionSlugs: CollectionSlug[] = [
  'posts',
  'pages',
  'events',
  'screeningSeries',
  'filmPrints',
  'seasons',
]

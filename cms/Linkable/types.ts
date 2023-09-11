import type {
  Post,
  StaticPage,
  Screening,
  ScreeningSery,
  FilmPrint,
} from 'payload/generated-types';

// each collection that has a url field must be added to this type
export type LinkableCollection = Post | StaticPage | Screening | ScreeningSery | FilmPrint;

// each collection that has a url field must be added to this array
export const LinkableCollectionSlugs = [
  'posts',
  'staticPages',
  'screenings',
  'screeningSeries',
  'filmPrints',
];
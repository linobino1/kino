// manually created types go here
import type { Post, Event, EventSery, FilmPrint, Season, Page } from '@app/types/payload'

// Collections with public routes that can be targeted by internal rich-text links.
export type LinkableCollection = Post | Page | Event | EventSery | FilmPrint | Season

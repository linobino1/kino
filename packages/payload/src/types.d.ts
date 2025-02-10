// manually created types go here
import type { Post, Event, EventSery, FilmPrint, Season, Page } from '@app/types/payload'

// each collection that has a url field must be added to this type
export type LinkableCollection = Post | Page | Event | EventSery | FilmPrint | Season

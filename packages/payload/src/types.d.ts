// manually created types go here
import type { Post, Event, ScreeningSery, FilmPrint, Season, Page } from '@app/types/payload'

// each collection that has a url field must be added to this type
export type LinkableCollection = Post | Page | Event | ScreeningSery | FilmPrint | Season

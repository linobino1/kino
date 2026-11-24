import { mediaPopulate } from './mediaPopulate'

export const eventListQuery = {
  select: {
    createdAt: true,
    updatedAt: true,
    title: true,
    subtitle: true,
    date: true,
    date_tz: true,
    season: true,
    header: true,
    comment: true,
    series: true,
    slug: true,
    isScreeningEvent: true,
    mainProgramFilmPrint: true,
    shortDescription: true,
  },
  depth: 3,
  populate: {
    eventSeries: {
      name: true,
      slug: true,
    },
    filmPrints: {
      movie: true,
      format: true,
      languageVersion: true,
    },
    movies: {
      title: true,
      synopsis: true,
      poster: true,
      duration: true,
      year: true,
      directors: true,
    },
    persons: {
      name: true,
    },
    formats: {
      name: true,
    },
    languageVersions: {
      abbreviation: true,
    },
    seasons: {
      name: true,
    },
    media: mediaPopulate,
  },
} as const

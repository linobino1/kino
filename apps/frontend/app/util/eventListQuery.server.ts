export const mediaListPopulate = {
  filename: true,
  url: true,
  alt: true,
  width: true,
  height: true,
  focalX: true,
  focalY: true,
} as const

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
    url: true,
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
    media: mediaListPopulate,
  },
} as const

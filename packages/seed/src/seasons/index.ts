import type { SeedContext } from '../types'

export const getCurrentSeasonName = (): string => {
  const currentYear = new Date().getFullYear()
  return `Winter term ${currentYear}`
}

export const seedSeasons = async ({ payload, media, ...context }: SeedContext): Promise<void> => {
  payload.logger.info(`— seeding seasons...`)
  const currentYear = new Date().getFullYear()
  // years from 2020 to next year
  const years = Array.from({ length: currentYear - 2020 + 2 }, (_, i) => 2020 + i)
  years.map(async (year) => {
    ;[
      {
        de: `Sommersemester ${year}`,
        en: `Summer term ${year}`,
      },
      {
        de: `Wintersemester ${year}`,
        en: `Winter term ${year}`,
      },
    ].map(async (name) => {
      const doc = await payload.create({
        collection: 'seasons',
        data: {
          name: name.de,
          header: media.get('hero.avif')?.id as string,
          url: '',
        },
        locale: 'de',
      })

      await payload.update({
        collection: 'seasons',
        id: doc.id,
        data: {
          name: name.en,
        },
        locale: 'en',
      })

      context.seasons.set(name.en, doc)

      year += 1
    })
  })
}

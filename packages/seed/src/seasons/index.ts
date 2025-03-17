import type { SeedContext } from '../types'
import { createSeason } from '#payload/util/createSeason'

export const getCurrentSeasonName = (): string => {
  const currentYear = new Date().getFullYear()
  return `Winter term ${currentYear}`
}

export const seedSeasons = async ({ payload, media, ...context }: SeedContext): Promise<void> => {
  payload.logger.info(`— seeding seasons...`)

  // years from 2020 to next year
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2020 + 2 }, (_, i) => 2020 + i)

  const header = media.get('hero.avif')?.id as string

  years.map(async (year) => {
    // create summer term and winter term for each year
    ;[new Date(`${year}-04-02T00:00:00.000Z`), new Date(`${year}-10-02T00:00:00.000Z`)].map(
      async (date) => {
        let season = await createSeason({
          date,
          header,
        })
        season = await payload.findByID({
          collection: 'seasons',
          id: season.id,
          locale: 'en',
          depth: 0,
        })
        context.seasons.set(season.name, season)
      },
    )
  })
}

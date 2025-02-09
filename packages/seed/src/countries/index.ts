import type { SeedContext } from '../types'
import countries from './countries.json'

export const seedCountries = async ({ payload }: SeedContext): Promise<void> => {
  payload.logger.info(`— seeding countries...`)
  for (const { id, name } of countries) {
    await payload.create({
      collection: 'countries',
      data: {
        id,
        name: name.de,
      },
      locale: 'de',
    })

    await payload.update({
      collection: 'countries',
      id,
      data: {
        name: name.en,
      },
      locale: 'en',
    })
  }
}

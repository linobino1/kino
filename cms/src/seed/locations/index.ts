import type { SeedContext } from '../types'
import locations from './locations.json'

export const seedLocations = async ({ payload, ...context }: SeedContext): Promise<void> => {
  payload.logger.info(`— seeding locations...`)
  for (const { name, isDefault } of locations) {
    const doc = await payload.create({
      collection: 'locations',
      data: {
        name: name.de,
        default: isDefault,
      },
      locale: 'de',
    })

    await payload.update({
      collection: 'locations',
      id: doc.id,
      data: {
        name: name.en,
      },
      locale: 'en',
    })

    payload.logger.info(`  added ${name.en}`)
    context.locations.set(name.en, doc)
  }
}

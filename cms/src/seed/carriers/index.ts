import type { SeedContext } from '../types'
import carriers from './carriers.json'

export const seedCarriers = async ({ payload, ...context }: SeedContext): Promise<void> => {
  payload.logger.info(`— seeding carriers...`)
  for (const { name } of carriers) {
    const doc = await payload.create({
      collection: 'carriers',
      data: {
        name: name.de,
      },
      locale: 'de',
    })

    await payload.update({
      collection: 'carriers',
      id: doc.id,
      data: {
        name: name.en,
      },
      locale: 'en',
    })

    payload.logger.info(`  added ${name.en}`)
    context.carriers.set(name.en, doc)
  }
}

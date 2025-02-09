import categories from './categories.json'
import type { SeedContext } from '../types'

export const seedCategories = async ({ payload, ...context }: SeedContext): Promise<void> => {
  payload.logger.info(`— seeding categories...`)
  for (const { name } of categories) {
    const doc = await payload.create({
      collection: 'categories',
      data: {
        name: name.de,
      },
      locale: 'de',
    })

    await payload.update({
      collection: 'categories',
      id: doc.id,
      data: {
        name: name.en,
      },
      locale: 'en',
    })

    payload.logger.info(`  added ${name.en}`)
    context.categories.set(name.en, doc)
  }
}

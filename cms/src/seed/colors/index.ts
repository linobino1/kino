import type { SeedContext } from '../types'
import colors from './colors.json'

export const seedColors = async ({ payload, ...context }: SeedContext): Promise<void> => {
  payload.logger.info(`— seeding colors...`)
  for (const { name } of colors) {
    const doc = await payload.create({
      collection: 'colors',
      data: {
        name: name.en,
      },
      locale: 'en',
    })

    await payload.update({
      collection: 'colors',
      id: doc.id,
      data: {
        name: name.de,
      },
      locale: 'de',
    })

    payload.logger.info(`  added ${name.en}`)
    context.colors.set(name.en, doc)
  }
}

import type { SeedContext } from '../types'
import conditions from './conditions.json'

export const seedConditions = async ({ payload, ...context }: SeedContext): Promise<void> => {
  payload.logger.info(`— seeding conditions...`)
  for (const { name } of conditions) {
    const doc = await payload.create({
      collection: 'conditions',
      data: {
        name: name.de,
      },
      locale: 'de',
    })

    await payload.update({
      collection: 'conditions',
      id: doc.id,
      data: {
        name: name.en,
      },
      locale: 'en',
    })

    payload.logger.info(`  added ${name.en}`)
    context.conditions.set(name.en, doc)
  }
}

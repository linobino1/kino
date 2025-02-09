import type { SeedContext } from '../types'
import formats from './formats.json'

export const seedFormats = async ({ payload, ...context }: SeedContext): Promise<void> => {
  payload.logger.info(`— seeding formats...`)
  for (const { name, type } of formats) {
    const doc = await payload.create({
      collection: 'formats',
      data: {
        name,
        type: type as 'analog' | 'digital',
      },
    })

    payload.logger.info(`  added ${name}`)
    context.formats.set(name, doc)
  }
}

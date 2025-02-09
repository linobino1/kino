import type { SeedContext } from '../types'
import soundFormats from './soundFormats.json'

export const seedSoundFormats = async ({ payload, ...context }: SeedContext): Promise<void> => {
  payload.logger.info(`— seeding soundFormats...`)
  for (const { name } of soundFormats) {
    const doc = await payload.create({
      collection: 'soundFormats',
      data: {
        name: name.de,
      },
      locale: 'de',
    })

    await payload.update({
      collection: 'soundFormats',
      id: doc.id,
      data: {
        name: name.en,
      },
      locale: 'en',
    })

    payload.logger.info(`  added ${name.en}`)
    context.soundFormats.set(name.en, doc)
  }
}

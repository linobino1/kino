import type { SeedContext } from '../types'
import aspectRatios from './aspectRatios.json'

export const seedAspectRatios = async ({ payload, ...context }: SeedContext): Promise<void> => {
  payload.logger.info(`— seeding aspect ratios...`)
  for (const data of aspectRatios) {
    const doc = await payload.create({
      collection: 'aspectRatios',
      data,
    })

    payload.logger.info(`  added ${data.name}`)
    context.aspectRatios.set(data.name, doc)
  }
}

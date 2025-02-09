import type { SeedContext } from '../types'
import languageVersions from './languageVersions.json'

export const seedLanguageVersions = async ({ payload, ...context }: SeedContext): Promise<void> => {
  payload.logger.info(`— seeding languageVersions...`)
  for (const { name, abbreviation } of languageVersions) {
    const doc = await payload.create({
      collection: 'languageVersions',
      data: {
        name: name.de,
        abbreviation: abbreviation.de,
      },
      locale: 'de',
    })

    await payload.update({
      collection: 'languageVersions',
      id: doc.id,
      data: {
        name: name.en,
        abbreviation: abbreviation.en,
      },
      locale: 'en',
    })

    payload.logger.info(`  added ${abbreviation.en}`)
    context.languageVersions.set(abbreviation.en, doc)
  }
}

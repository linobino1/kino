import type { Payload } from 'payload'

export const createLanguageVersion = async ({ payload }: { payload: Payload }) =>
  await payload.create({
    collection: 'languageVersions',
    data: {
      name: 'English Original',
      abbreviation: 'En. OV',
    },
  })

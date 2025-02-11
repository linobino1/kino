import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb'
import type { CollectionSlug } from 'payload'

// This migration will save all docs that have a missing URL field
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  return
  const collections = payload.config.collections.filter(
    (collection) => !!collection.custom.addUrlField,
  )
  await Promise.all(
    collections.map(async (collection) => {
      const { docs, errors } = await payload.update({
        collection: collection.slug as CollectionSlug,
        where: {
          url: {
            exists: false,
          },
        },
        data: {
          url: '',
        },
      })
      payload.logger.info(`Generated ${docs.length} missing URLs for ${collection.slug} docs...`)
      if (errors.length) {
        payload.logger.info(
          `Encountered those errors while working on the ${collection.slug} collection:`,
        )
        payload.logger.info(errors.map((error) => `doc ${error.id}: ${error.message}`).join('\n'))
      }
    }),
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // Migration code
}

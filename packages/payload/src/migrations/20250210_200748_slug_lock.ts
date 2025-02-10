import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'
import type { CollectionSlug } from 'payload'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  // we'll add slugLock: false to all existing documents in collection that have the slug field
  const collections: CollectionSlug[] = payload.config.collections
    .filter((collection) =>
      collection.fields.some((field) => 'name' in field && field.name === 'slug'),
    )
    .map((collection) => collection.slug)

  for await (const collection of collections) {
    payload.logger.info(`Updating collection ${collection} to unlock all slugs`)
    await payload.db.connection.collection(collection).updateMany(
      {
        slug: { $exists: true },
      },
      {
        $set: {
          slugLock: false,
        },
      },
    )
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Migration code
}

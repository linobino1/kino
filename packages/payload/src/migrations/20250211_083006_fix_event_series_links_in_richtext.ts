import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'
import type { CollectionSlug } from 'payload'
import { deepReplace } from '#payload/util/deepReplace'

const collections: CollectionSlug[] = [
  'posts',
  'pages',
  'events',
  'eventSeries',
  'mailings',
  'navigations',
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  for await (const collection of collections) {
    const docs = await payload.db.connection.collection(collection).find({}).toArray()

    for await (const doc of docs) {
      const updatedDoc = deepReplace(doc, 'screeningSeries', 'eventSeries')

      delete updatedDoc._id

      await payload.db.connection.collection(collection).replaceOne({ _id: doc._id }, updatedDoc)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  for await (const collection of collections) {
    const docs = await payload.db.connection.collection(collection).find({}).toArray()

    for await (const doc of docs) {
      const updatedDoc = deepReplace(doc, 'eventSeries', 'screeningSeries')

      delete updatedDoc._id

      await payload.db.connection.collection(collection).replaceOne({ _id: doc._id }, updatedDoc)
    }
  }
}

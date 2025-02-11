import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'
import { deepReplace } from '#payload/util/deepReplace'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  // let's replace all "screenings-series" with "event-series" in the "eventSeries" collection, so that the URLs are being updated
  const docs = await payload.db.connection.collection('eventSeries').find({}).toArray()

  for await (const doc of docs) {
    const updatedDoc = deepReplace(doc, 'screening-series', 'event-series')

    delete updatedDoc._id

    await payload.db.connection.collection('eventSeries').replaceOne({ _id: doc._id }, updatedDoc)
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // let's replace all "event-series" with "screening-series" in the "eventSeries" collection, so that the URLs are being updated
  const docs = await payload.db.connection.collection('eventSeries').find({}).toArray()

  for await (const doc of docs) {
    const updatedDoc = deepReplace(doc, 'event-series', 'screening-series')

    delete updatedDoc._id

    await payload.db.connection.collection('eventSeries').replaceOne({ _id: doc._id }, updatedDoc)
  }
}

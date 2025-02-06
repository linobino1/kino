import { DatabaseAdapter } from 'payload'

export const mongoReplace = async (
  database: DatabaseAdapter,
  needle: string,
  replacement: string,
) => {
  console.log(`Replacing ${needle} with ${replacement}...`)
  const  db  = database.connection.db!

  const collections = (await db.listCollections().toArray()).map((collection) => collection.name)

  for (const collection of collections) {
    const cursor = db.collection(collection).find()
    const bulk = db.collection(collection).initializeUnorderedBulkOp()

    while (await cursor.hasNext()) {
      const doc = await cursor.next()
      if (!doc) continue
      //   console.log(`Updating ${collection} ${doc._id}`, JSON.stringify(doc))
      const updatedDoc = JSON.parse(
        JSON.stringify(doc).replace(new RegExp(needle, 'g'), replacement),
      )
      if (JSON.stringify(doc) === JSON.stringify(updatedDoc)) {
        continue
      }

      console.log(`Updated ${collection} ${doc._id}`) //, JSON.stringify(updatedDoc))
      delete updatedDoc._id
      bulk.find({ _id: doc._id }).updateOne({ $set: updatedDoc })
    }

    if (bulk.batches.length > 0) await bulk.execute()
  }

  console.log(`Finished replacing ${needle} with ${replacement}`)
}

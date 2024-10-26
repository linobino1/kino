import { Payload } from 'payload'
import { migrateBlocks } from './migrateBlocks'

type Props = {
  payload: Payload
  slug: string
  globalType: string
}

export const migratePageFromGlobal = async ({
  payload,
  slug,
  globalType,
}: Props): Promise<string> => {
  const { db } = payload

  // get data
  const data = JSON.parse(JSON.stringify(await db.globals.findOne({ globalType })))

  // remove pre-existing page
  await payload.delete({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  // let payload create the page
  const doc = await payload.create({
    collection: 'pages',
    data: {
      slug,
      url: `/${slug}`,
      title: slug,
      blocks: [],
      hero: {
        type: 'none',
      },
    },
  })

  // migrate blocks
  const migratedBlocks = migrateBlocks(data.layout.blocks)

  // add data
  await db.collections.pages.updateOne({ _id: doc.id }, [
    {
      $set: {
        layoutType: data.layout.type,
        ...migratedBlocks,
        meta: data.meta,
        title: data.meta?.title,
      },
    },
  ])

  return doc.id
}

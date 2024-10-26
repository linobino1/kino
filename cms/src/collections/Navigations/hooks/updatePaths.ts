import { Navigation } from '@/payload-types'
import { CollectionBeforeChangeHook } from 'payload'

export const updatePaths: CollectionBeforeChangeHook<Navigation> = async ({
  data,
  req: { payload },
}) => {
  await Promise.all(
    (data.items ?? []).map(async (item) => {
      if (item.type === 'internal') {
        const doc = await payload.findByID({
          collection: 'pages',
          id: item.page as string,
        })
        item.relPath = doc.url
      }
      return item
    }),
  )
}

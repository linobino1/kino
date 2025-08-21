import type { CollectionSlug, Field } from 'payload'

/**
 * a helper function to get the id of the default doc for a collection with a 'default' field
 * @param collection collection slug
 * @returns string | undefined the id of the default doc for the collection or null if none is set
 */
export const getDefaultDocId = async (collection: string): Promise<string | undefined> => {
  try {
    return (
      await fetch(`/api/${collection}/?where[default][equals]=true`).then((res) => res.json())
    ).docs[0].id
  } catch {
    return undefined
  }
}

/**
 * a checkbox to mark a doc as default for a collection
 */
export const defaultField = (collection: CollectionSlug): Field => ({
  name: 'default',
  type: 'checkbox',
  label: 'wird als Standard verwendet',
  hooks: {
    beforeChange: [
      async ({ req, value }) => {
        // unset previous default doc to false
        if (value) {
          await req.payload.update({
            collection,
            where: {
              default: {
                equals: true,
              },
            },
            data: {
              default: false,
            },
            req,
          })
        }
        return value
      },
    ],
  },
})

import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const MovieBlock: Block = {
  slug: 'movieBlock',
  fields: [
    {
      name: 'movie',
      type: 'relationship',
      relationTo: 'movies',
      required: true,
      filterOptions() {
        return {
          _status: {
            equals: 'published',
          },
        }
      },
    },
    {
      name: 'additionalText',
      label: 'zusätzliche Informationen',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => defaultFeatures,
      }),
    },
  ],
}

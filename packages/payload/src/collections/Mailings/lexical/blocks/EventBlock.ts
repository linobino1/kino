import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const EventBlock: Block = {
  slug: 'eventBlock',
  fields: [
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
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

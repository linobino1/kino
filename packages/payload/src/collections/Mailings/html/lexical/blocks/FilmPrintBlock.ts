import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const FilmPrintBlock: Block = {
  slug: 'filmPrintBlock',
  labels: {
    singular: 'Filmkopie',
    plural: 'Filmkopien',
  },
  fields: [
    {
      name: 'filmPrint',
      type: 'relationship',
      relationTo: 'filmPrints',
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

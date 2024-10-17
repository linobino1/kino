import type { Block } from 'payload'
import { t } from '@/i18n'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const FilmPrintBlock: Block = {
  slug: 'filmPrintBlock',
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
      label: t('additional info'),
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => defaultFeatures,
      }),
    },
  ],
}

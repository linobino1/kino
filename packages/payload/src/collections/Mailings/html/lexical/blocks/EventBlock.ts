import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const EventBlock: Block = {
  slug: 'eventBlock',
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
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
      name: 'type',
      label: 'Art',
      type: 'radio',
      defaultValue: 'compact',
      options: [
        {
          label: 'Kompakt',
          value: 'compact',
        },
        {
          label: 'Programmpunkte ausklappen',
          value: 'unfoldProgramItems',
        },
      ],
      required: true,
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

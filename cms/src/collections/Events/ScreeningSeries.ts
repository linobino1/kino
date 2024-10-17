import type { CollectionConfig } from 'payload'
import pageLayout from '@/fields/pageLayout'

export const ScreeningSeries: CollectionConfig = {
  slug: 'screeningSeries',
  labels: {
    singular: 'Vorstellungsreihe',
    plural: 'Vorstellungsreihen',
  },
  admin: {
    group: 'Kalender',
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  access: {
    read: () => true,
  },
  custom: {
    addUrlField: {
      hook: (slug?: string) => `/screening-series/${slug || ''}`,
    },
    addSlugField: {
      from: 'name',
    },
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      localized: true,
      required: true,
    },
    pageLayout({
      defaultLayout: [
        {
          blockType: 'headerImage',
        },
        {
          blockType: 'heading',
        },
        {
          blockType: 'content',
        },
        {
          blockType: 'outlet',
        },
      ],
    }),
  ],
}

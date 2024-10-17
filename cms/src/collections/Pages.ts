import type { CollectionConfig } from 'payload'
import { metaField } from '@/fields/meta'
import { pageLayout } from '@/fields/pageLayout'

export const Pages: CollectionConfig = {
  slug: 'staticPages',
  labels: {
    singular: 'Statische Seite',
    plural: 'Statische Seiten',
  },
  admin: {
    group: 'Seiten',
    defaultColumns: ['title'],
    useAsTitle: 'title',
  },
  custom: {
    addUrlField: {
      hook: (slug?: string) => `/${slug || ''}`,
    },
    addSlugField: {
      from: 'title',
    },
  },
  fields: [
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      localized: true,
      required: true,
    },
    pageLayout({
      defaultLayout: [
        {
          blockType: 'heading',
        },
        {
          blockType: 'content',
        },
      ],
    }),
    metaField('Meta'),
  ],
}

import pageLayout from '#payload/fields/pageLayout'
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Seite',
    plural: 'Seiten',
  },
  admin: {
    group: 'Seiten',
    defaultColumns: ['title', 'slug'],
    useAsTitle: 'title',
    components: {
      beforeList: ['/components/MagicSlugsExplanation'],
    },
    pagination: {
      defaultLimit: 20,
    },
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
    {
      name: 'layoutType',
      label: 'Layout',
      type: 'radio',
      defaultValue: 'default',
      options: [
        { label: 'Standard', value: 'default' },
        { label: 'Info', value: 'info' },
      ],
    },
    pageLayout,
  ],
}

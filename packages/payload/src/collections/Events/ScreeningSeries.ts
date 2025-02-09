import pageLayout from '#payload/fields/pageLayout'
import type { CollectionConfig } from 'payload'

export const ScreeningSeries: CollectionConfig = {
  slug: 'screeningSeries',
  labels: {
    singular: 'Veranstaltungsreihe',
    plural: 'Veranstaltungsreihen',
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
    pageLayout,
  ],
}

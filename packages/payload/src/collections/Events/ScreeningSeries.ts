import type { CollectionConfig } from 'payload'
import pageLayout from '#payload/fields/pageLayout'
import { slugField } from '#payload/fields/slug'

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
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      localized: true,
      required: true,
    },
    ...slugField('name'),
    pageLayout,
  ],
}

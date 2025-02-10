import type { CollectionConfig } from 'payload'
import { slugField } from '#payload/fields/slug'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: {
    singular: 'Tätigkeit',
    plural: 'Tätigkeiten',
  },
  admin: {
    group: 'Konfiguration',
    defaultColumns: ['name'],
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      localized: true,
      required: true,
      unique: true,
    },
    ...slugField('name'),
  ],
}

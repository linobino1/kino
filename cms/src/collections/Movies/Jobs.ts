import type { CollectionConfig } from 'payload'

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
  custom: {
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
      unique: true,
    },
  ],
}

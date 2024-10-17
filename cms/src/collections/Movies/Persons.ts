import type { CollectionConfig } from 'payload'

export const Persons: CollectionConfig = {
  slug: 'persons',
  labels: {
    singular: 'Person',
    plural: 'Personen',
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
      required: true,
      unique: true,
    },
  ],
}

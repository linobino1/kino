import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Kategorie',
    plural: 'Kategorien',
  },
  admin: {
    group: 'Konfiguration',
    defaultColumns: ['type', 'name'],
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
    },
  ],
}

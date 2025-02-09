import type { CollectionConfig } from 'payload'

export const Countries: CollectionConfig = {
  slug: 'countries',
  labels: {
    singular: 'Land',
    plural: 'Länder',
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
      name: 'id',
      type: 'text',
      admin: {
        description: 'Ländercode (2-stellig)',
      },
      required: true,
      unique: true,
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      localized: true,
    },
  ],
}

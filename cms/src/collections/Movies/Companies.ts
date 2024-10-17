import type { CollectionConfig } from 'payload'

export const Companies: CollectionConfig = {
  slug: 'companies',
  labels: {
    singular: 'Firma',
    plural: 'Firmen',
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

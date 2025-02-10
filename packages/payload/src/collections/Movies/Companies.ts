import type { CollectionConfig } from 'payload'
import { slugField } from '#payload/fields/slug'

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
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      unique: true,
    },
    ...slugField('name'),
  ],
}

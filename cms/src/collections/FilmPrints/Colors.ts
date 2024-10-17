import type { CollectionConfig } from 'payload'

export const Colors: CollectionConfig = {
  slug: 'colors',
  labels: {
    singular: 'Farbe',
    plural: 'Farben',
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

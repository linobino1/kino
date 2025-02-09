import type { CollectionConfig } from 'payload'

export const Carriers: CollectionConfig = {
  slug: 'carriers',
  labels: {
    singular: 'Träger',
    plural: 'Träger',
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

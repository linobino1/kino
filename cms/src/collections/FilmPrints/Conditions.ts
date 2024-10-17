import type { CollectionConfig } from 'payload'

export const Conditions: CollectionConfig = {
  slug: 'conditions',
  labels: {
    singular: 'Zustand',
    plural: 'Zustände',
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
      type: 'text',
      localized: true,
      required: true,
    },
  ],
}

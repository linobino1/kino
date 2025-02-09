import type { CollectionConfig } from 'payload'

export const SoundFormats: CollectionConfig = {
  slug: 'soundFormats',
  labels: {
    singular: 'Tonformat',
    plural: 'Tonformate',
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
    },
  ],
}

import type { CollectionConfig } from 'payload'

export const AspectRatios: CollectionConfig = {
  slug: 'aspectRatios',
  labels: {
    singular: 'Seitenverhältnis',
    plural: 'Seitenverhältnisse',
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
    },
  ],
}

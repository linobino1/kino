import type { CollectionConfig } from 'payload'
import analogDigitalTypeField from './fields'

export const Formats: CollectionConfig = {
  slug: 'formats',
  labels: {
    singular: 'Filmformat',
    plural: 'Filmformate',
  },
  admin: {
    group: 'Konfiguration',
    defaultColumns: ['name', 'type'],
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    analogDigitalTypeField('type'),
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
  ],
}

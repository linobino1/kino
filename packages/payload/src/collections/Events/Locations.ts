import type { CollectionConfig } from 'payload'
import { defaultField } from '#payload/fields/default'
import { slugField } from '#payload/fields/slug'

export const Locations: CollectionConfig = {
  slug: 'locations',
  labels: {
    singular: 'Spielstätte',
    plural: 'Spielstätten',
  },
  admin: {
    group: 'Konfiguration',
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      required: true,
      localized: true,
      type: 'text',
    },
    ...slugField('name'),
    defaultField('locations'),
    {
      name: 'address',
      label: 'Adresse',
      type: 'textarea',
      required: true,
    },
  ],
}

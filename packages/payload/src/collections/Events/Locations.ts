import type { CollectionConfig } from 'payload'
import { defaultField } from '#payload/fields/default'

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
  custom: {
    addSlugField: {
      from: 'name',
    },
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      localized: true,
      type: 'text',
    },
    defaultField('locations'),
  ],
}

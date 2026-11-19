import type { CollectionConfig } from 'payload'
import { defaultField } from '#payload/fields/default'
import { slugField } from 'payload'
import { formatSlug } from '@app/util/formatSlug'

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
    slugField({
      useAsSlug: 'name',
      checkboxName: 'slugLock',
      disableUnique: true,
      required: false,
      slugify: ({ valueToSlugify }) => formatSlug(valueToSlugify),
    }),
    defaultField('locations'),
    {
      name: 'address',
      label: 'Adresse',
      type: 'textarea',
      required: true,
    },
  ],
}

import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { formatSlug } from '@app/util/formatSlug'

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
    slugField({
      useAsSlug: 'name',
      checkboxName: 'slugLock',
      disableUnique: true,
      required: false,
      slugify: ({ valueToSlugify }) => formatSlug(valueToSlugify),
    }),
  ],
}

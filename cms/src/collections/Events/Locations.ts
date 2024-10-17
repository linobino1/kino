import type { CollectionConfig } from 'payload'
import { t } from '@/i18n'
import { defaultField } from '@/fields/default'

export const Locations: CollectionConfig = {
  slug: 'locations',
  labels: {
    singular: t('Location'),
    plural: t('Locations'),
  },
  admin: {
    group: t('Configuration'),
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
      label: t('Name'),
      localized: true,
      type: 'text',
    },
    defaultField('locations'),
  ],
}

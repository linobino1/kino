import type { CollectionConfig } from 'payload'
import { t } from '@/i18n'

export const Countries: CollectionConfig = {
  slug: 'countries',
  labels: {
    singular: t('Country'),
    plural: t('Countries'),
  },
  admin: {
    group: t('Configuration'),
    defaultColumns: ['name'],
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      admin: {
        description: t('alpha2 country code'),
      },
      required: true,
      unique: true,
    },
    {
      name: 'name',
      label: t('Name'),
      type: 'text',
      required: true,
      localized: true,
    },
  ],
}

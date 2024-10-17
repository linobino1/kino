import type { CollectionConfig } from 'payload'
import { t } from '@/i18n'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: t('Category'),
    plural: t('Categories'),
  },
  admin: {
    group: t('Configuration'),
    defaultColumns: ['type', 'name'],
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: t('Name'),
      type: 'text',
      localized: true,
      required: true,
    },
  ],
}

import type { CollectionConfig } from 'payload'
import { t } from '@/i18n'

export const Companies: CollectionConfig = {
  slug: 'companies',
  labels: {
    singular: t('Company'),
    plural: t('Companies'),
  },
  admin: {
    group: t('Configuration'),
    defaultColumns: ['name'],
    useAsTitle: 'name',
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
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}

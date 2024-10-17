import type { CollectionConfig } from 'payload'
import { t } from '@/i18n'

export const Conditions: CollectionConfig = {
  slug: 'conditions',
  labels: {
    singular: t('Condition'),
    plural: t('Conditions'),
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
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
    },
  ],
}

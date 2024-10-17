import type { CollectionConfig } from 'payload'
import { t } from '@/i18n'

export const AspectRatios: CollectionConfig = {
  slug: 'aspectRatios',
  labels: {
    singular: t('Aspect Ratio'),
    plural: t('Aspect Ratios'),
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
      label: t('Name'),
      type: 'text',
      required: true,
    },
  ],
}

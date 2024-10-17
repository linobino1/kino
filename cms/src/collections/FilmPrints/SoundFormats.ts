import type { CollectionConfig } from 'payload'
import { t } from '@/i18n'

export const SoundFormats: CollectionConfig = {
  slug: 'soundFormats',
  labels: {
    singular: t('Sound Format'),
    plural: t('Sound Formats'),
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
      localized: true,
      required: true,
    },
  ],
}

import type { CollectionConfig } from 'payload'
import { getBackendTFunction } from '@app/i18n/getBackendTFunction'
import { getSafeLocale } from '@app/i18n/getSafeLocale'

export const Rentals: CollectionConfig = {
  slug: 'rentals',
  labels: {
    singular: 'Verleih',
    plural: 'Verleihe',
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
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'credits',
      label: 'Credits',
      type: 'textarea',
      localized: true,
      required: true,
      defaultValue: async ({ req: { locale } }) => {
        const t = await getBackendTFunction(getSafeLocale(locale))
        return t('rentals.credits.default')
      },
      admin: {
        description: 'In allen Sprachen bearbeiten!',
      },
    },
  ],
}

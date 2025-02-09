import type { CollectionConfig } from 'payload'

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
      defaultValue: 'Leihgabe der Filmkopie mit freundlicher Unterstützung von XXX.',
      admin: {
        description: 'In allen Sprachen bearbeiten!',
      },
    },
  ],
}

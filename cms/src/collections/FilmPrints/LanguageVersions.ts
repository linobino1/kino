import type { CollectionConfig } from 'payload'

export const LanguageVersions: CollectionConfig = {
  slug: 'languageVersions',
  labels: {
    singular: 'Sprachfassung',
    plural: 'Sprachfassungen',
  },
  admin: {
    group: 'Konfiguration',
    defaultColumns: ['abbreviation', 'name'],
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
      localized: true,
      required: true,
    },
    {
      name: 'abbreviation',
      label: 'Kürzel',
      type: 'text',
      localized: true,
      required: true,
    },
  ],
}

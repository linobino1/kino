import type { CollectionConfig } from 'payload'
import { slugField } from '#payload/fields/slug'

export const Seasons: CollectionConfig = {
  slug: 'seasons',
  labels: {
    singular: 'Spielzeit',
    plural: 'Spielzeiten',
  },
  admin: {
    group: 'Konfiguration',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  defaultSort: '-from',
  access: {
    read: () => true,
  },
  custom: {
    addUrlField: {
      hook: (slug?: string) => `/seasons/${slug || ''}`,
    },
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      localized: true,
      required: true,
    },
    ...slugField('name'),
    {
      name: 'from',
      label: 'Von einschließlich',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'until',
      label: 'Bis einschließlich',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'header',
      label: 'Header',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}

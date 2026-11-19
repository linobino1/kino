import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { formatSlug } from '@app/util/formatSlug'

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
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      localized: true,
      required: true,
    },
    slugField({
      useAsSlug: 'name',
      checkboxName: 'slugLock',
      disableUnique: true,
      required: false,
      slugify: ({ valueToSlugify }) => formatSlug(valueToSlugify),
    }),
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

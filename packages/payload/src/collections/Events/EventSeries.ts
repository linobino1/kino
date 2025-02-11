import type { CollectionConfig } from 'payload'
import pageLayout from '#payload/fields/pageLayout'
import { slugField } from '#payload/fields/slug'

export const EventSeries: CollectionConfig<'eventSeries'> = {
  slug: 'eventSeries',
  labels: {
    singular: 'Veranstaltungsreihe',
    plural: 'Veranstaltungsreihen',
  },
  admin: {
    group: 'Kalender',
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  access: {
    read: () => true,
  },
  custom: {
    addUrlField: {
      hook: (slug?: string) => `/event-series/${slug || ''}`,
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
      name: 'description',
      label: 'Beschreibung',
      type: 'richText',
      localized: true,
      admin: {
        description: 'Beschreibung der Veranstaltungsreihe für das Presse-PDF.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Seitenlayout',

          fields: [pageLayout],
        },
      ],
    },
    {
      name: 'header',
      type: 'upload',
      relationTo: 'media',
      virtual: true,
      hooks: {
        afterRead: [({ data }) => data?.hero.image],
      },
      admin: {
        hidden: true,
      },
    },
  ],
}

import type { CollectionConfig } from 'payload'
import { pageLayout } from '#payload/fields/pageLayout'
import { slugField } from 'payload'
import { formatSlug } from '@app/util/formatSlug'
import { attachedLinksField } from '#payload/fields/attachedLinks'

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
      name: 'description',
      label: 'Beschreibung',
      type: 'richText',
      localized: true,
      admin: {
        description: 'Beschreibung der Veranstaltungsreihe für das Presse-PDF.',
      },
    },
    attachedLinksField({ excludeEvent: true }),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Seitenlayout',
          fields: [
            pageLayout({
              excludeBlocks: ['events'],
              blocksFieldDescription:
                'Die Veranstaltungen der Reihe werden automatisch nach dem Inhalt angezeigt.',
            }),
          ],
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

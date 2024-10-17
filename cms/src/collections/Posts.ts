import type { CollectionConfig } from 'payload'
import { Content } from '@/blocks/Content'
import { Image } from '@/blocks/Image'
import { Gallery } from '@/blocks/Gallery'
import { Video } from '@/blocks/Video'
import { LinkableCollectionSlugs } from '@/types'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    group: 'Blog',
    defaultColumns: ['date', 'title'],
    useAsTitle: 'title',
  },
  defaultSort: '-date',
  custom: {
    addUrlField: {
      hook: (slug?: string) => `/news/${slug || ''}`,
    },
    addSlugField: {
      from: 'title',
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: Date(),
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    {
      name: 'header',
      label: 'Titelbild',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content',
      label: 'Vorschau',
      type: 'richText',
      localized: true,
      required: true,
    },
    {
      name: 'details',
      label: 'Details',
      type: 'blocks',
      blocks: [Content, Image, Gallery, Video],
      admin: {
        description: 'Füge eine Detailseite für diesen Post hinzu',
      },
    },
    {
      type: 'group',
      label: 'Link',
      name: 'link',
      admin: {
        description: 'Verlinke das Titelbild.',
      },
      fields: [
        {
          name: 'type',
          label: 'Art',
          type: 'radio',
          defaultValue: 'none',
          admin: {
            description:
              "Wähle 'Keine(r)' um das Titelbild mit der Detailseite zu verlinken, falls diese existiert.",
          },
          options: [
            {
              label: 'Keine(r)',
              value: 'none',
            },
            {
              label: 'Interner Link',
              value: 'internal',
            },
            {
              label: 'Externer Link',
              value: 'external',
            },
          ],
        },
        // internal link
        {
          name: 'doc',
          type: 'relationship',
          relationTo: LinkableCollectionSlugs,
          required: true,
          admin: {
            condition: (siblingData) => siblingData.link?.type === 'internal',
          },
        },
        // external link
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            condition: (siblingData) => siblingData.link?.type === 'external',
          },
        },
      ],
    },
  ],
}

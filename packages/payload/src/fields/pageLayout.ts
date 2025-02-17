import type { Field } from 'payload'
import { Content } from '#payload/blocks/Content'
import { Image } from '#payload/blocks/Image'
import { Gallery } from '#payload/blocks/Gallery'
import { Video } from '#payload/blocks/Video'
import { KronolithCalendarEmbed } from '#payload/blocks/KronolithCalendarEmbed'
import { Events } from '#payload/blocks/Events'

export type Props = {
  defaultLayout?: any
}

export const pageLayout: Field = {
  type: 'tabs',
  tabs: [
    {
      name: 'hero',
      label: 'Hero',
      fields: [
        {
          name: 'type',
          label: 'Art',
          type: 'radio',
          defaultValue: 'image',
          options: [
            { label: 'Bild', value: 'image' },
            { label: 'Nur Überschrift', value: 'headline' },
            { label: 'Kein Hero', value: 'none' },
          ],
        },
        {
          name: 'headline',
          label: 'Überschrift',
          type: 'text',
          localized: true,
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.type !== 'none',
          },
        },
        {
          name: 'image',
          label: 'Bild',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'image',
          },
        },
      ],
    },
    {
      label: 'Inhalt',
      fields: [
        {
          name: 'blocks',
          label: false,
          type: 'blocks',
          blocks: [Content, Gallery, Image, Video, Events, KronolithCalendarEmbed],
          defaultValue: [
            {
              blockType: Content.slug,
            },
          ],
        },
      ],
    },
  ],
}

export default pageLayout

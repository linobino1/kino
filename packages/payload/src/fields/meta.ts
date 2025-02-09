import type { Field } from 'payload'
import type { Site } from '@app/types/payload'

export type Meta = Site['meta']

export const metaField = (label?: string): Field => ({
  name: 'meta',
  label,
  type: 'group',
  fields: [
    {
      name: 'title',
      label: 'Titel',
      localized: true,
      type: 'text',
    },
    {
      name: 'description',
      label: 'Beschreibung',
      localized: true,
      type: 'textarea',
    },
    {
      name: 'keywords',
      label: 'Keywords',
      type: 'text',
    },
    {
      name: 'image',
      label: 'Bild',
      type: 'upload',
      relationTo: 'media',
    },
  ],
})

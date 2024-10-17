import type { Field } from 'payload'
import { t } from '@/i18n'
import type { Site } from '@/payload-types'

export type Meta = Site['meta']

export const metaField = (label: Record<string, string>): Field => ({
  name: 'meta',
  label,
  type: 'group',
  fields: [
    {
      name: 'title',
      label: t('Title'),
      localized: true,
      type: 'text',
    },
    {
      name: 'description',
      label: t('Description'),
      localized: true,
      type: 'textarea',
    },
    {
      name: 'keywords',
      label: t('Keywords'),
      type: 'text',
    },
    {
      name: 'image',
      label: t('Image'),
      type: 'upload',
      relationTo: 'media',
    },
  ],
})

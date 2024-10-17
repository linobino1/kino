import type { Block } from 'payload'
import { t } from '@/i18n'

export const Gallery: Block = {
  slug: 'gallery',
  labels: {
    singular: t('Gallery'),
    plural: t('Galleries'),
  },
  fields: [
    {
      name: 'images',
      type: 'array',
      minRows: 2,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}

export default Gallery

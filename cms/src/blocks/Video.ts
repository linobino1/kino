import type { Block } from 'payload'
import { t } from '@/i18n'

export const Video: Block = {
  slug: 'video',
  labels: {
    singular: t('Video'),
    plural: t('Videos'),
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
    },
  ],
}

export default Video

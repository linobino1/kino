import type { Block } from "payload/types";
import { t } from '../i18n';

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
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}

export default Gallery;
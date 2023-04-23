import type { Block } from "payload/types";
import { t } from '../i18n';

export const Image: Block = {
  slug: 'image',
  labels: {
    singular: t('Image (Full Width)'),
    plural: t('Images (Full Width)'),
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}

export default Image;
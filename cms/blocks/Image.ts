import type { Block } from "payload/types";
import { t } from '../i18n';

export const Image: Block = {
  slug: 'image',
  labels: {
    singular: t('Image'),
    plural: t('Images'),
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}

export default Image;
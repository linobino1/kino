import type { Block } from "payload/types";
import { t } from '../i18n';

export const HeaderImage: Block = {
  slug: 'headerImage',
  labels: {
    singular: t('Header'),
    plural: t('Headers'),
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      required: true,
      relationTo: 'media',
    },
  ],
}

export default HeaderImage;
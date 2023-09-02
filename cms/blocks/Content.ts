import type { Block } from "payload/types";
import { t } from '../i18n';

export const Content: Block = {
  slug: 'content',
  labels: {
    singular: t('Content'),
    plural: t('Content'),
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
  ],
}

export default Content;
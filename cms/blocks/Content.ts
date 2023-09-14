import type { Block } from "payload/types";
import { t } from '../i18n';
import video from '../fields/richtext/video';

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
      admin: {
        elements: [
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'link',
          'ol',
          'ul',
          'indent',
          'upload',
          video,
        ],
        leaves: ['bold', 'italic', 'underline', 'strikethrough'],
      },
    },
  ],
}

export default Content;
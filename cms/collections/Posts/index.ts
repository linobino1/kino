import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';
import { slugField } from '../../fields/slug';

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    group: t('Blog'),
    defaultColumns: ['date', 'title'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    slugField('title'),
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: Date(),
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'header',
      label: t('Header Image'),
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content',
      label: t('Content'),
      type: 'richText',
      localized: true,
      required: true,
    },
    {
      name: 'link',
      label: t('Link'),
      type: 'text',
    },
  ],
};

export default Posts;

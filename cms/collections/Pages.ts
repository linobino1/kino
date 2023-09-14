import type { CollectionConfig } from 'payload/types';
import { t } from '../i18n';
import { slugField } from '../fields/slug';
import { metaField } from '../fields/meta';
import { pageLayout } from '../fields/pageLayout';

const Pages: CollectionConfig = {
  slug: 'staticPages',
  labels: {
    singular: t('Static page'),
    plural: t('Static pages'),
  },
  admin: {
    group: t('Pages'),
    defaultColumns: ['title'],
    useAsTitle: 'title',
  },
  custom: {
    addUrlField: {
      hook: (slug?: string) => `/${slug || ''}`,
    },
  },
  fields: [
    {
      name: 'title',
      label: t('Title'),
      type: 'text',
      localized: true,
      required: true,
    },
    slugField('title'),
    pageLayout({
      defaultLayout: [
        {
          blockType: 'heading',
        },
        {
          blockType: 'content',
        },
      ]
    }),
    metaField(t('Meta')),
  ],
};

export default Pages;

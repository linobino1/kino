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
  fields: [
    {
      name: 'title',
      label: t('Title'),
      type: 'text',
      localized: true,
      required: true,
    },
    slugField('title'),
    pageLayout(),
    metaField(t('Meta')),
  ],
};

export default Pages;

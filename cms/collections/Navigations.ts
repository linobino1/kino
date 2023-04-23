import type { CollectionConfig } from 'payload/types';
import { t } from '../i18n';

export const Navigations: CollectionConfig = {
  slug: 'navigations',
  admin: {
    group: t('Config'),
    useAsTitle: 'type',
    defaultColumns: ['type'],
  },
  labels: {
    singular: t('Navigation'),
    plural: t('Navigations'),
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        {
          label: 'Main Navigation',
          value: 'main',
        },
        {
          label: 'Mobile Navigation',
          value: 'mobile',
        },
        {
          label: 'Footer Navigation',
          value: 'footer',
        },
        {
          label: 'Social Media',
          value: 'socialMedia',
        },
      ],
      required: true,
    },
    {
      name: 'items',
      label: t('Items'),
      type: 'array',
      minRows: 1,
      admin: {
        components: {
          RowLabel: ({ data }: { data: any}): string => data.name,
        },
      },
      fields: [
        {
          name: 'type',
          label: t('Type'),
          type: 'radio',
          defaultValue: 'internal',
          options: [
            {
              label: t('Internal Link'),
              value: 'internal',
            },
            {
              label: t('External Link'),
              value: 'external',
            },
            {
              label: t('Subnavigation'),
              value: 'subnavigation',
            },
            {
              label: t('Language Switch'),
              value: 'language',
            },
          ],
        },
        {
          name: 'name',
          label: t('Name'),
          type: 'text',
          localized: true,
          required: true,
          admin: {
            condition: (data, siblingData) => siblingData.type !== 'language',
          },
        },
        // internal link
        {
          name: 'page',
          label: t('Page'),
          type: 'relationship',
          relationTo: 'pages',
          required: true,
          admin: {
            condition: (data, siblingData) => siblingData.type === 'internal',
          },
        },
        // external link
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            condition: (data, siblingData) => siblingData.type === 'external',
          },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData.type === 'external',
          },
        },
        // subnavigation
        {
          name: 'subnavigation',
          label: t('Subnavigation'),
          type: 'relationship',
          relationTo: 'navigations',
          admin: {
            condition: (data, siblingData) => siblingData.type === 'subnavigation',
          },
        },
      ],
    },
  ],
};

export default Navigations;

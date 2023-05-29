import type { CollectionConfig } from 'payload/types';
import { t } from '../i18n';

export const Navigations: CollectionConfig = {
  slug: 'navigations',
  admin: {
    group: t('System'),
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
        {
          label: 'Subnavigation',
          value: 'subnavigation',
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
          RowLabel: ({ data }: { data: any}): string => data.name || data.type,
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
          relationTo: 'staticPages',
          admin: {
            condition: (data, siblingData) => siblingData.type === 'internal',
          },
        },
        {
          name: 'relPath',
          label: t('Relative Path'),
          type: 'text',
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
        {
          name: 'newTab',
          label: t('Open in new tab'),
          type: 'checkbox',
          defaultValue: false,
          admin: {
            condition: (data, siblingData) => siblingData.type !== 'language',
          },
        },
      ],
    },
  ],
};

export default Navigations;

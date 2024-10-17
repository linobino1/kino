import type { CollectionConfig } from 'payload'

export const Navigations: CollectionConfig = {
  slug: 'navigations',
  admin: {
    group: 'System',
    useAsTitle: 'type',
    defaultColumns: ['type'],
  },
  labels: {
    singular: 'Menü',
    plural: 'Menüs',
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
      label: 'Elemente',
      type: 'array',
      minRows: 1,
      admin: {
        components: {
          RowLabel: '/components/RowLabelNavigationItem',
        },
      },
      fields: [
        {
          name: 'type',
          label: 'Art',
          type: 'radio',
          defaultValue: 'internal',
          options: [
            {
              label: 'Interner Link',
              value: 'internal',
            },
            {
              label: 'Externer Link',
              value: 'external',
            },
            {
              label: 'Untermenü',
              value: 'subnavigation',
            },
            {
              label: 'Sprachwahlschalter',
              value: 'language',
            },
          ],
        },
        {
          name: 'name',
          label: 'Name',
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
          label: 'Seite',
          type: 'relationship',
          relationTo: 'staticPages',
          admin: {
            condition: (data, siblingData) => siblingData.type === 'internal',
          },
        },
        {
          name: 'relPath',
          label: 'Relative URL',
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
          label: 'Untermenü',
          type: 'relationship',
          relationTo: 'navigations',
          admin: {
            condition: (data, siblingData) => siblingData.type === 'subnavigation',
          },
        },
        {
          name: 'newTab',
          label: 'In neuem Tab öffnen',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            condition: (data, siblingData) => siblingData.type !== 'language',
          },
        },
      ],
    },
  ],
}

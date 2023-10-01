import type { GlobalConfig } from 'payload/types';
import { t } from '../i18n';
import { metaField } from '../fields/meta';

export const Site: GlobalConfig = {
  slug: 'site',
  admin: {
    group: t('System'),
  },
  label: t('Site Configuration'),
  fields: [
    {
      name: 'logo',
      label: t('Logo'),
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'logoMobile',
      label: t('Logo (mobile)'),
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'footerContent',
      label: t('Footer Content'),
      type: 'richText',
      localized: true,
    },
    {
      name: 'location',
      label: t('Location'),
      type: 'group',
      fields: [
        {
          name: 'country',
          label: t('Country'),
          type: 'relationship',
          relationTo: 'countries',
          required: true,
        },
        {
          name: 'region',
          label: t('Region'),
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          label: t('City'),
          type: 'text',
          required: true,
        },
        {
          name: 'zip',
          label: t('Zip'),
          type: 'text',
          required: true,
        },
        {
          name: 'street',
          label: t('Street'),
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          label: t('Name'),
          type: 'text',
          required: true,
        },
        {
          name: 'latitude',
          label: t('Latitude'),
          type: 'text',
          required: true,
        },
        {
          name: 'longitude',
          label: t('Longitude'),
          type: 'text',
          required: true,
        },
      ],
    },
    metaField(t('Global Meta')),
  ],
};

export default Site;

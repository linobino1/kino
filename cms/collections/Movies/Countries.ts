import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';

const Countries: CollectionConfig = {
  slug: 'countries',
  labels: {
    singular: t('Country'),
    plural: t('Countries'),
  },
  admin: {
    group: t('Movie Database'),
    defaultColumns: ['name'],
    useAsTitle: 'name',
    hidden: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      admin: {
        description: t('alpha2 country code'),
      },
      required: true,
      unique: true,
    },
    {
      name: 'name',
      label: t('Name'),
      type: 'text',
      required: true,
      localized: true,
    },
  ],
};

export default Countries;

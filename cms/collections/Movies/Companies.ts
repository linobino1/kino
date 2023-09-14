import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';

const Companies: CollectionConfig = {
  slug: 'companies',
  labels: {
    singular: t('Company'),
    plural: t('Companies'),
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
  custom: {
    addSlugField: {
      from: 'name',
    },
  },
  fields: [
    {
      name: 'name',
      label: t('Name'),
      type: 'text',
      required: true,
      unique: true,
    },
  ],
};

export default Companies;

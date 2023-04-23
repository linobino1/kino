import type { CollectionConfig } from 'payload/types';
import { t } from '../i18n';

const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: t('User'),
    plural: t('Users'),
  },
  auth: true,
  admin: {
    group: t('Config'),
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  fields: [
    // Email added by default
    {
      name: 'name',
      label: t('Name'),
      type: 'text',
      required: true,
    },
  ],
  timestamps: true,
};

export default Users;

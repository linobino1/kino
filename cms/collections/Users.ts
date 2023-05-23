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
    group: t('System'),
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  access: {
    admin: ({ req: { user }, id }) => user?.id === id || ['admin', 'editor'].includes(user?.role),
    read: ({ req: { user }, id }) => user?.id === id || ['admin', 'editor'].includes(user?.role),
    update: ({ req: { user } }) => ['admin', 'editor'].includes(user?.role),
    create: ({ req: { user } }) => ['admin', 'editor'].includes(user?.role),
    delete: ({ req: { user } }) => ['admin', 'editor'].includes(user?.role),
  },
  fields: [
    // Email added by default
    {
      name: 'name',
      label: t('Name'),
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: t('Role'),
      type: 'select',
      defaultValue: 'subscriber',
      options: [
        {
          label: t('Admin'),
          value: 'admin',
        },
        {
          label: t('Editor'),
          value: 'editor',
        },
        {
          label: t('Subscriber'),
          value: 'subscriber',
        },
      ],
    },
  ],
  timestamps: true,
};

export default Users;

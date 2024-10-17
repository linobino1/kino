import type { CollectionConfig } from 'payload'
import { t } from '@/i18n'

/**
 * Backend users
 */
export const Users: CollectionConfig = {
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
    read: ({ req: { user }, id }) => user?.id === id || user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    create: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
    admin: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    unlock: ({ req: { user } }) => user?.role === 'admin',
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
      options: [
        {
          label: t('Admin'),
          value: 'admin',
        },
        {
          label: t('Editor'),
          value: 'editor',
        },
      ],
    },
  ],
  timestamps: true,
}

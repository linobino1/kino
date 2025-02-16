import { env } from '@app/util/env/backend.server'
import type { CollectionConfig } from 'payload'

/**
 * Backend users
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Benutzer',
    plural: 'Benutzer',
  },
  auth: {
    cookies: {
      domain:
        env.NODE_ENV === 'development' ? undefined : `.${env.BACKEND_URL.replace('https://', '')}`,
      sameSite: 'Lax',
    },
  },
  admin: {
    group: 'System',
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
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: 'Rolle',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
      ],
    },
  ],
  timestamps: true,
}

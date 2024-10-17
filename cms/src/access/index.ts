import type { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin'

export const isEditor: Access = ({ req: { user } }) => user?.role === 'editor'

export const isAdminOrEditor: Access = ({ req: { user } }) =>
  user?.role === 'admin' || user?.role === 'editor'

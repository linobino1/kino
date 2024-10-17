import type { GlobalConfig } from 'payload'
import { metaField } from '@/fields/meta'
import pageLayout from '@/fields/pageLayout'

export const Blog: GlobalConfig = {
  slug: 'blog',
  admin: {
    group: 'Seiten',
  },
  label: 'Blog',
  fields: [pageLayout(), metaField('Meta')],
}

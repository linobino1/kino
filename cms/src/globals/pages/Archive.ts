import type { GlobalConfig } from 'payload'
import { metaField } from '@/fields/meta'
import pageLayout from '@/fields/pageLayout'

export const Archive: GlobalConfig = {
  slug: 'archive',
  admin: {
    group: 'Seiten',
  },
  label: 'Filmarchiv',
  fields: [pageLayout(), metaField('Meta')],
}

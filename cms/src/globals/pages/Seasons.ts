import type { GlobalConfig } from 'payload'
import { metaField } from '@/fields/meta'
import pageLayout from '@/fields/pageLayout'

export const SeasonsPage: GlobalConfig = {
  slug: 'seasonsPage',
  admin: {
    group: 'Seiten',
  },
  label: 'Spielzeiten',
  fields: [pageLayout(), metaField('Meta')],
}

import type { CollectionConfig } from 'payload'

export const Sitemap: CollectionConfig<'sitemap'> = {
  slug: 'sitemap',
  admin: {
    hidden: true,
  },
  timestamps: false,
  defaultSort: ['-priority', '-lastModified'],
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      // unique: true, --- so far this is disabled because I'm not sure how to enforce it
    },
    {
      name: 'lastModified',
      type: 'date',
      required: true,
    },
    {
      name: 'priority',
      type: 'number',
      required: true,
      defaultValue: 0.5,
    },
  ],
}

import type { CollectionConfig } from 'payload'
import { pageLayout } from '#payload/fields/pageLayout'
import { slugField } from 'payload'
import { formatSlug } from '@app/util/formatSlug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Seite',
    plural: 'Seiten',
  },
  admin: {
    group: 'Seiten',
    defaultColumns: ['title', 'url'],
    useAsTitle: 'title',
    components: {
      beforeList: ['./components/MagicSlugsExplanation#MagicSlugsExplanation'],
    },
    pagination: {
      defaultLimit: 20,
    },
  },
  custom: {
    addUrlField: {
      hook: (slug?: string) => (slug === 'home' ? '/' : `/${slug}`),
    },
  },
  fields: [
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      localized: true,
      required: true,
    },
    slugField({
      useAsSlug: 'title',
      checkboxName: 'slugLock',
      disableUnique: true,
      required: false,
      slugify: ({ valueToSlugify }) => formatSlug(valueToSlugify),
    }),
    {
      name: 'layoutType',
      label: 'Layout',
      type: 'radio',
      defaultValue: 'default',
      options: [
        { label: 'Standard', value: 'default' },
        { label: 'Info', value: 'info' },
      ],
    },
    pageLayout(),
  ],
}

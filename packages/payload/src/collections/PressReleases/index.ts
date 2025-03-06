import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '#payload/access/index'
import { locales } from '@app/i18n'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { env } from '@app/util/env/backend.server'

export const PressReleases: CollectionConfig<'pressReleases'> = {
  slug: 'pressReleases',
  labels: {
    singular: 'Pressemitteilung',
    plural: 'Pressemitteilungen',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Promo',
    preview: (doc) => {
      return `${env.FRONTEND_URL}/press-releases/${doc?.id}.pdf?preview=true`
    },
  },
  access: {
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'date',
      label: 'Datum',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'season',
      label: 'Spielzeit',
      type: 'relationship',
      relationTo: 'seasons',
      required: true,
    },
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      required: true,
    },
    {
      name: 'coverText',
      label: 'Text auf Titelseite',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => defaultFeatures,
      }),
      required: true,
    },
    {
      name: 'linkToPDF',
      label: 'Download PDF',
      type: 'text',
      hooks: {
        afterRead: [
          ({ data }) => (data ? `${env.FRONTEND_URL}/press-releases/${data.id}.pdf` : ''),
        ],
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
        components: {
          Field: {
            path: '/components/DownloadButton#DownloadButton',
          },
        },
      },
    },
    {
      name: 'locale',
      label: 'Sprache',
      type: 'select',
      options: locales.map((locale) => ({
        label: locale,
        value: locale,
      })),
      defaultValue: 'de',
      required: true,
      admin: {
        position: 'sidebar',
        description:
          'Die Sprache, in der die Eventinfos dargestellt werden sollen. Derzeit nur Deutsch verfügbar.',
        readOnly: true,
      },
    },
  ],
}

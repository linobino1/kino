import type { CollectionConfig } from 'payload'
import type { Movie, Format } from '@/payload-types'
import analogDigitalTypeField from './fields'
// import { MigrateMovieButton } from '@/MigrateMovie/admin/Button'
import { isAdminOrEditor } from '@/access'
import { type Locale } from 'shared/config'

export const FilmPrints: CollectionConfig = {
  slug: 'filmPrints',
  labels: {
    singular: 'Filmkopie',
    plural: 'Filmkopien',
  },
  defaultSort: '-createdAt',
  admin: {
    group: 'Filmdatenbank',
    defaultColumns: ['title', 'format', 'languageVersion', 'isRented', '_status'],
    useAsTitle: 'title',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: (args) => {
      if (isAdminOrEditor(args)) return true
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },
  timestamps: true,
  custom: {
    addUrlField: {
      hook: (slug?: string) => `/filmprints/${slug || ''}`,
    },
    addSlugField: {
      from: 'title',
    },
  },
  hooks: {
    beforeValidate: [
      // set title and slug from movie.title and movie.format
      async ({ data, req }) => {
        if (!req) return data // this hook is only used server-side
        if (!data?.movie || !data?.format) return data

        // we'll name all filmprints in fallback language
        const locale = req.payload.config.i18n.fallbackLanguage as Locale

        if (!data.title) {
          // create title from movie, format & language version (short)
          const movie = (
            await req.payload.find({
              collection: 'movies',
              locale,
              where: {
                _id: {
                  equals: data.movie,
                },
              },
            })
          ).docs[0] as unknown as Movie
          const format = (
            await req.payload.find({
              collection: 'formats',
              locale,
              where: {
                _id: {
                  equals: data.format,
                },
              },
            })
          ).docs[0] as unknown as Format
          const languageVersion = (
            await req.payload.find({
              collection: 'languageVersions',
              locale,
              where: {
                _id: {
                  equals: data.languageVersion,
                },
              },
            })
          ).docs[0]
          data.title = `${movie.internationalTitle} ${format.name} ${languageVersion?.abbreviation}`
        }

        return data
      },
    ],
  },
  fields: [
    // TODO
    // {
    //   name: 'migrateMovie',
    //   type: 'ui',
    //   admin: {
    //     condition: (data) => !data?.movie,
    //     components: {
    //       Field: MigrateMovieButton,
    //     },
    //   },
    // },
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Wird automatisch generiert, wenn das Feld leer ist.',
      },
    },
    {
      name: 'movie',
      label: 'Film',
      type: 'relationship',
      relationTo: 'movies',
      required: true,
      hasMany: false,
      filterOptions: {
        _status: {
          equals: 'published',
        },
      },
    },
    analogDigitalTypeField('type'),
    {
      name: 'format',
      label: 'Filmformat',
      type: 'relationship',
      relationTo: 'formats',
      required: true,
      filterOptions: ({ data }) => ({ type: { equals: data?.type } }),
    },
    {
      name: 'languageVersion',
      label: 'Sprachfassung',
      type: 'relationship',
      relationTo: 'languageVersions',
      hasMany: false,
      required: true,
    },
    {
      name: 'isRented',
      label: 'Ist Leihkopie',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          // admin: {
          //   condition: (data) => !data?.isRented,
          // },
          fields: [
            {
              name: 'rental',
              label: 'Geliehen von',
              type: 'relationship',
              relationTo: 'rentals',
              hasMany: false,
              required: false,
              admin: {
                condition: (data) => data?.isRented,
              },
            },
            {
              name: 'carrier',
              label: 'Träger',
              type: 'relationship',
              relationTo: 'carriers',
              admin: {
                condition: (data) => data?.type === 'analog' && !data?.isRented,
              },
              required: true,
            },
            {
              name: 'category',
              label: 'Kategorie',
              type: 'relationship',
              relationTo: 'categories',
              admin: {
                condition: (data) => data?.type === 'analog' && !data?.isRented,
              },
              required: true,
            },
            {
              name: 'numActs',
              label: 'Anzahl Akte',
              type: 'number',
              admin: {
                condition: (data) => data?.type === 'analog' && !data?.isRented,
              },
              required: true,
            },
            {
              name: 'aspectRatio',
              label: 'Seitenverhältnis',
              type: 'relationship',
              relationTo: 'aspectRatios',
              admin: {
                condition: (data) => !data?.isRented,
              },
              required: true,
            },
            {
              name: 'color',
              label: 'Farbe',
              type: 'relationship',
              relationTo: 'colors',
              required: true,
              admin: {
                condition: (data) => !data?.isRented,
              },
            },
            {
              name: 'soundFormat',
              label: 'Tonformat',
              type: 'relationship',
              relationTo: 'soundFormats',
              admin: {
                condition: (data) => !data?.isRented,
              },
              required: true,
            },
            {
              name: 'condition',
              label: 'Zustand',
              type: 'relationship',
              relationTo: 'conditions',
              admin: {
                condition: (data) => data?.type === 'analog' && !data?.isRented,
              },
            },
          ],
        },
      ],
    },
  ],
}

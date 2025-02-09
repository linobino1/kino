import type { CollectionConfig, PayloadRequest } from 'payload'
import type { Movie } from '@app/types/payload'
import { isAdminOrEditor } from '#payload/access'
import { ageRatingAges } from '@app/util/config'

export const Movies: CollectionConfig = {
  slug: 'movies',
  labels: {
    singular: 'Film',
    plural: 'Filme',
  },
  hooks: {
    afterDelete: [
      async ({ doc, req }: { doc: Movie; req: PayloadRequest }) => {
        // delete all media associated with this movie
        const ids = [doc.still, doc.poster]
          .map((x) => (typeof x === 'object' ? x.id : x))
          .filter(Boolean) as string[]
        try {
          await req.payload.delete({
            collection: 'media',
            where: {
              id: {
                in: ids,
              },
            },
          })
        } catch {
          // at least we tried..
        }
        return true
      },
    ],
  },
  admin: {
    listSearchableFields: ['title', 'internationalTitle', 'originalTitle'],
    group: 'Filmdatenbank',
    defaultColumns: ['internationalTitle', 'directors', 'year', '_status'],
    useAsTitle: 'internationalTitle',
    components: {
      beforeListTable: ['/components/MigrateMovieButton#MigrateMovieButton'],
    },
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
  custom: {
    addSlugField: {
      from: 'internationalTitle',
    },
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description:
          'Titel des Films, wie er auf der Webseite verwendet wird. Übersetzungen können in den Sprachversionen angelegt werden.',
      },
    },
    {
      name: 'internationalTitle',
      label: 'Internationaler Titel',
      type: 'text',
      required: true,
      admin: {
        description: 'Internationaler Titel des Films, gewöhnlich der englische Titel',
      },
    },
    {
      name: 'originalTitle',
      label: 'Originaltitel',
      type: 'text',
      required: true,
      admin: {
        description: 'Originaltitel des Films',
      },
    },
    {
      name: 'tmdbId',
      label: 'themoviedb.org ID',
      type: 'number',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      // make sure the TMDB ID is empty or unique
      // @ts-expect-error https://github.com/payloadcms/payload/issues/7549
      validate: async (value, { operation, req: { payload } }) => {
        if (typeof value === 'undefined') return true

        const res = await payload.find({
          collection: 'movies',
          where: {
            tmdbId: {
              equals: value,
            },
          },
        })

        const maxDocs = operation === 'update' ? 1 : 0 // when updating, the current movie is included in totalDocs
        if (res.totalDocs > maxDocs) {
          const movie = res.docs[0]
          return `<a href="/admin/collections/movies/${movie.id}">${movie.title}</a> wurde schon angelegt`
        }

        return true
      },
    },
    {
      name: 'still',
      label: 'Filmstill',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'Titelbild im Querformat (16:9 o.ä.) mit einer Mindestbreite von 2000px. In der Regel sollte ein Standbild aus dem Film verwendet werden.',
      },
    },
    {
      name: 'poster',
      label: 'Filmposter',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Filmposter im Porträtformat (2:3) mit einer Mindestbreite von 200px',
      },
    },
    {
      name: 'directors',
      label: 'Regie',
      type: 'relationship',
      relationTo: 'persons',
      hasMany: true,
      required: true,
    },
    {
      name: 'duration',
      label: 'Laufzeit',
      type: 'number',
      min: 0,
      admin: {
        description: 'Dauer in Minuten',
      },
      required: true,
    },
    {
      name: 'ageRating',
      label: 'Altersfreigabe',
      type: 'select',
      options: ageRatingAges
        .map((x) => ({
          label: `ab ${x} Jahren`,
          value: `${x}`,
        }))
        .concat({
          label: 'nicht zertifiziert',
          value: '',
        }),
      defaultValue: '0',
    },
    {
      name: 'countries',
      label: 'Produktionsland',
      type: 'relationship',
      relationTo: 'countries',
      hasMany: true,
      required: true,
    },
    {
      name: 'year',
      label: 'Erscheinungsjahr',
      type: 'number',
      required: true,
    },
    {
      name: 'decade',
      type: 'number',
      required: true,
      validate: () => true as const,
      hidden: true,
      hooks: {
        beforeChange: [
          ({ siblingData }): void => {
            // ensures data is not stored in DB
            delete siblingData['decade']
          },
        ],
        afterRead: [
          async ({ siblingData }) => {
            if (!siblingData.year) return null
            return Math.floor((siblingData.year as number) / 10) * 10
          },
        ],
      },
    },
    {
      name: 'isHfgProduction',
      label: 'Ist eine HfG-Produktion',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'genres',
      label: 'Genre',
      type: 'relationship',
      relationTo: 'genres',
      hasMany: true,
      minRows: 1,
      required: true,
    },
    {
      name: 'synopsis',
      label: 'Synopsis',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Kurze Inhaltsangabe, maximal 350 Zeichen',
      },
      required: true,
    },
    {
      name: 'trailer',
      label: 'Trailer',
      type: 'text',
      required: false,
    },
    {
      label: 'Credits',
      type: 'tabs',
      tabs: [
        {
          label: 'Darsteller',
          fields: [
            {
              name: 'cast',
              label: 'Darsteller',
              type: 'relationship',
              relationTo: 'persons',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Crew',
          fields: [
            {
              name: 'crew',
              label: 'Crew',
              type: 'array',
              fields: [
                {
                  name: 'person',
                  label: 'Person',
                  type: 'relationship',
                  relationTo: 'persons',
                  required: true,
                },
                {
                  name: 'job',
                  label: 'Tätigkeit',
                  type: 'relationship',
                  relationTo: 'jobs',
                  hasMany: false,
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Produktionsfirmen',
          fields: [
            {
              name: 'productionCompanies',
              label: 'Produktionsfirmen',
              type: 'relationship',
              relationTo: 'companies',
              hasMany: true,
            },
          ],
        },
      ],
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'text',
      admin: {
        description: 'Komma-getrennte Tags.',
        condition: (data) => !data?.isRented,
      },
    },
    {
      type: 'collapsible',
      label: 'Wordpress Import Info',
      fields: [
        {
          name: 'isMigratedFromWordpress',
          type: 'checkbox',
          label: 'Von Wordpress importiert',
          defaultValue: () => false,
        },
        {
          name: 'wordpressMigrationNotes',
          type: 'textarea',
          label: 'Notizen',
        },
      ],
    },
  ],
}

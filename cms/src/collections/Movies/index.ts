import type { CollectionConfig, PayloadRequest } from 'payload'
import type { Movie } from '@/payload-types'
import { t } from '@/i18n'
import { isAdminOrEditor } from '@/access'

export const ageRatingAges = [0, 6, 12, 16, 18]

export const Movies: CollectionConfig = {
  slug: 'movies',
  labels: {
    singular: t('Movie'),
    plural: t('Movies'),
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
        } catch (err) {
          // at least we tried..
        }
        return true
      },
    ],
  },
  admin: {
    listSearchableFields: ['title', 'internationalTitle', 'originalTitle'],
    group: t('Movie Database'),
    defaultColumns: ['internationalTitle', 'directors', 'year', '_status'],
    useAsTitle: 'internationalTitle',
    components: {
      // TODO
      // BeforeListTable: [
      // add a button to migrate a movie from TMDB
      // () => MigrateMovieButton({}),
      // ],
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
      label: t('Title'),
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description: t('AdminExplainMovieTitle'),
      },
    },
    {
      name: 'internationalTitle',
      label: t('International Title'),
      type: 'text',
      required: true,
      admin: {
        description: t('AdminExplainInternationalTitle'),
      },
    },
    {
      name: 'originalTitle',
      label: t('Original Title'),
      type: 'text',
      required: true,
      admin: {
        description: t('AdminExplainOriginalTitle'),
      },
    },
    {
      name: 'tmdbId',
      label: t('TMDB ID'),
      type: 'number',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      // make sure the TMDB ID is empty or unique
      // @ts-expect-error https://github.com/payloadcms/payload/issues/7549
      validate: async (value, { operation, t, payload }) => {
        if (typeof value === undefined) return true

        // on server we need the base url, on client we don't
        const baseUrl = process?.env.PAYLOAD_PUBLIC_SERVER_URL ?? ''
        try {
          const res = await fetch(`${baseUrl}/api/movies?where[tmdbId][equals]=${value}`)
          const data = await res.json()
          const totalDocs = operation === 'update' ? 1 : 0 // when updating, the current movie is included in totalDocs
          if (data.totalDocs > totalDocs) {
            const movie = data.docs[0]
            return t('MovieExists', {
              title: movie.internationalTitle,
              id: movie.id,
            })
          }
        } catch (err) {
          return t('Unable to validate TMDB ID')
        }
        return true
      },
    },
    {
      name: 'still',
      label: t('Film Still'),
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: t('AdminExplainFilmStill'),
      },
    },
    {
      name: 'poster',
      label: t('Poster'),
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: t('AdminExplainPoster'),
      },
    },
    {
      name: 'directors',
      label: t('Director'),
      type: 'relationship',
      relationTo: 'persons',
      hasMany: true,
      required: true,
    },
    {
      name: 'duration',
      label: t('Playing Time'),
      type: 'number',
      min: 0,
      admin: {
        description: t('Duration in minutes'),
      },
      required: true,
    },
    {
      name: 'ageRating',
      label: t('Age Rating'),
      type: 'select',
      options: ageRatingAges
        .map((x) => ({
          label: t('ageRating {age}', { age: `${x}` }),
          value: `${x}`,
        }))
        .concat({
          label: t('Not rated'),
          value: '',
        }),
      defaultValue: '0',
    },
    {
      name: 'countries',
      label: t('Country of Production'),
      type: 'relationship',
      relationTo: 'countries',
      hasMany: true,
      required: true,
    },
    {
      name: 'year',
      label: t('Year of publication'),
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
      label: t('Is a HfG Production'),
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'genres',
      label: t('Genre'),
      type: 'relationship',
      relationTo: 'genres',
      hasMany: true,
      minRows: 1,
      required: true,
    },
    {
      name: 'synopsis',
      label: t('Synopsis'),
      type: 'textarea',
      localized: true,
      admin: {
        description: t('AdminExplainSynopsis'),
      },
      required: true,
    },
    {
      name: 'trailer',
      label: t('Trailer'),
      type: 'text',
      required: false,
    },
    {
      label: t('Credits'),
      type: 'tabs',
      tabs: [
        {
          label: t('Cast'),
          fields: [
            {
              name: 'cast',
              label: t('Cast'),
              type: 'relationship',
              relationTo: 'persons',
              hasMany: true,
            },
          ],
        },
        {
          label: t('Crew'),
          fields: [
            {
              name: 'crew',
              label: t('Crew'),
              type: 'array',
              fields: [
                {
                  name: 'person',
                  label: t('Person'),
                  type: 'relationship',
                  relationTo: 'persons',
                  required: true,
                },
                {
                  name: 'job',
                  label: t('Job'),
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
          label: t('Production Companies'),
          fields: [
            {
              name: 'productionCompanies',
              label: t('Production Companies'),
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
      label: t('Tags'),
      type: 'text',
      admin: {
        description: t('Comma-separated list of tags.'),
        condition: (data) => !data?.isRented,
      },
    },
    {
      type: 'collapsible',
      label: t('Wordpress Import Info'),
      fields: [
        {
          name: 'isMigratedFromWordpress',
          type: 'checkbox',
          label: t('Imported from Wordpress'),
          defaultValue: () => false,
        },
        {
          name: 'wordpressMigrationNotes',
          type: 'textarea',
          label: t('Notes'),
        },
      ],
    },
  ],
}

import type { CollectionConfig, PayloadRequest } from 'payload/types';
import type { Media, Movie } from 'payload/generated-types';
import { t } from '../../i18n';
import { slugField } from '../../fields/slug';
import MigrateMovieButton from '../../MigrateMovie/admin/Button';

export const ageRatingAges = [0, 6, 12, 16, 18];

const Movies: CollectionConfig = {
  slug: 'movies',
  labels: {
    singular: t('Movie'),
    plural: t('Movies'),
  },
  hooks: {
    afterDelete: [
      async ({ doc, req }: { doc: Movie, req: PayloadRequest}) => {
        // delete all media associated with this movie
        await req.payload.delete({
          collection: 'media',
          where: {
            id: {
              in: [
                (doc.still as Media).id,
                (doc.poster as Media).id,
              ],
            },
          },
        });
      },
    ],
  },
  admin: {
    group: t('Movie Database'),
    defaultColumns: ['internationalTitle', 'directors', 'year', '_status'],
    useAsTitle: 'originalTitle',
    components: {
      BeforeListTable: [
        // add a button to migrate a movie from TMDB
        MigrateMovieButton,
      ],
    },
  },
  access: {
    read: () => true,
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
    slugField('internationalTitle'),
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
      validate: async (value, { operation, t, payload }) => {
        if (value === null) return true;
        
        // on server we need the base url, on client we don't
        const baseUrl = payload ? payload.config.serverURL : '';
        try {
          const res = await fetch(`${baseUrl}/api/movies?where[tmdbId][equals]=${value}`);
          const data = await res.json();
          const totalDocs = operation === 'update' ? 1 : 0; // when updating, the current movie is included in totalDocs
          if (data.totalDocs > totalDocs) {
            return t('Movie already exists');
          }
        } catch (err) {
          return t('Unable to validate TMDB ID');
        }
        return true;
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
      options: ageRatingAges.map((x) => ({
        label: t('ageRating {age}', { age: `${x}` }),
        value: `${x}`,
      })).concat({
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
      name: 'isHfgProduction',
      label: t('Is a HfG Production'),
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'genre',
      label: t('Genre'),
      type: 'relationship',
      relationTo: 'genres',
      hasMany: false,
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
                  name: 'role',
                  label: t('Role'),
                  type: 'text',
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
  ],
};

export default Movies;

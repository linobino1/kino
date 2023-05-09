import type { OptionObject } from 'payload/dist/fields/config/types';
import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';
import { slugField } from '../../fields/slug';

export const ageLimitAges = [0, 6, 12, 16, 18];
const ageLimitOptions: OptionObject[] = ageLimitAges.map((x) => ({
  label: `FSK${x}`,
  value: `${x}`,
}));

const Movies: CollectionConfig = {
  slug: 'movies',
  labels: {
    singular: t('Movie'),
    plural: t('Movies'),
  },
  admin: {
    group: t('Movie Database'),
    defaultColumns: ['originalTitle', 'directors', 'publicationDate'],
    useAsTitle: 'originalTitle',
    components: {
      
    }
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'tmdbId',
      label: t('TMDB ID'),
      type: 'number',
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
      name: 'title',
      label: t('Title'),
      type: 'text',
      localized: true,
      required: true,
    },
    slugField('title'),
    {
      name: 'originalTitle',
      label: t('Original Title'),
      type: 'text',
      required: true,
    },
    {
      name: 'still',
      label: t('Film Still'),
      type: 'upload',
      relationTo: 'stills',
      required: true,
      admin: {
        description: t('AdminExplainFilmStill'),
      },
    },
    {
      name: 'poster',
      label: t('Poster'),
      type: 'upload',
      relationTo: 'posters',
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
      name: 'ageLimit',
      label: t('Age Limit'),
      type: 'select',
      options: ageLimitOptions,
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
      ],
    },
  ],
};

export default Movies;

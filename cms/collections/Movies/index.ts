import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';
import { slugField } from '../../fields/slug';

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
      validate: async (value, { t, payload }) => {
        if (value === null) return true;
        
        // on server we need the base url, on client we don't
        const baseUrl = payload ? payload.config.serverURL : '';
        try {
          const res = await fetch(`${baseUrl}/api/movies?where[tmdbId][equals]=${value}`);
          const data = await res.json();
          if (data.totalDocs > 0) {
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
      name: 'cast',
      label: t('Cast'),
      type: 'relationship',
      relationTo: 'persons',
      hasMany: true,
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
      maxLength: 350,
      admin: {
        description: t('AdminExplainSynopsis'),
      },
      required: true,
    },
  ],
};

export default Movies;

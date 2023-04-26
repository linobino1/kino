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
  },
  access: {
    read: () => true,
  },
  fields: [
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
    },
    {
      name: 'country',
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
      name: 'genres',
      label: t('Genre'),
      type: 'relationship',
      relationTo: 'genres',
      hasMany: true,
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

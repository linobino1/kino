import type { CollectionConfig } from 'payload/types';
import type { Movie, Format } from 'payload/generated-types';
import { t } from '../../i18n';
import { slugField, slugFormat } from '../../fields/slug';
import analogDigitalTypeField from './fields';

export const FilmPrints: CollectionConfig = {
  slug: 'filmPrints',
  labels: {
    singular: t('Film Print'),
    plural: t('Film Prints'),
  },
  defaultSort: '-createdAt',
  admin: {
    group: t('Movie Database'),
    defaultColumns: ['title', 'isRented', '_status'],
    useAsTitle: 'title',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
  },
  timestamps: true,
  hooks: {
    beforeValidate: [
      // set title and slug from movie.title and movie.format
      async ({ data, req }) => {
        if (!req) return data;  // this hook is only used server-side
        if (!data?.movie || !data?.format) return data;
        
        if (!data.title) {
          // create title from movie & format
          const movie = (await req.payload.find({
            collection: 'movies',
            where: {
              _id: {
                equals: data.movie,
              },
            },
          })).docs[0] as Movie;
          const format = (await req.payload.find({
            collection: 'formats',
            where: {
              _id: {
                equals: data.format,
              },
            },
          })).docs[0] as Format;
          const title = `${movie.originalTitle} ${format.name}`;
          data.title = title;
        }
        
        // create slug from title
        if (!data.slug) {
          data.slug = slugFormat(data.title);
        }

        return data;
      },
    ],
  },
  fields: [
    {
      name: 'title',
      label: t('Title'),
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    slugField('title'),
    {
      name: 'movie',
      label: t('Movie'),
      type: 'relationship',
      relationTo: 'movies',
      required: true,
      hasMany: false,
    },
    {
      name: 'isRented',
      label: t('Is rental'),
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'rental',
      label: t('Rental'),
      type: 'relationship',
      relationTo: 'rentals',
      hasMany: false,
      admin: {
        condition: (data) => data?.isRented,
      },
    },
    {
      name: 'languageVersion',
      label: t('Language Version'),
      type: 'relationship',
      relationTo: 'languageVersions',
      hasMany: false,
      required: true,
    },
    analogDigitalTypeField('type'),
    {
      type: 'collapsible',
      label: t('Format'),
      fields: [
        {
          name: 'format',
          label: t('Film Format'),
          type: 'relationship',
          relationTo: 'formats',
          required: true,
          filterOptions: ({ data }) => (
            { type: { equals: data?.type } }
          ),
        },
        {
          name: 'carrier',
          label: t('Carrier'),
          type: 'relationship',
          relationTo: 'carriers',
          admin: {
            condition: (data) => data?.type === 'analog',
          },
          required: true,
        },
        {
          name: 'numActs',
          label: t('Number of Acts'),
          type: 'number',
          admin: {
            condition: (data) => data?.type === 'analog',
          },
          required: true,
        },
        {
          name: 'aspectRatio',
          label: t('Aspect Ratio'),
          type: 'relationship',
          relationTo: 'aspectRatios',
          required: true,
        },
        {
          name: 'soundFormat',
          label: t('Sound Format'),
          type: 'relationship',
          relationTo: 'soundFormats',
          required: true,
        },
        {
          name: 'condition',
          label: t('Condition'),
          type: 'relationship',
          relationTo: 'conditions',
          admin: {
            condition: (data) => data?.type === 'analog' && !data?.isRented,
          },
        },
      ],
    },
  ],
};

export default FilmPrints;

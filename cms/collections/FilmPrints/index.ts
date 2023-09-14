import type { CollectionConfig } from 'payload/types';
import type { Movie, Format } from 'payload/generated-types';
import { t } from '../../i18n';
import analogDigitalTypeField from './fields';
import { MigrateMovieButton } from '../../MigrateMovie/admin/Button';

export const FilmPrints: CollectionConfig = {
  slug: 'filmPrints',
  labels: {
    singular: t('Film Print'),
    plural: t('Film Prints'),
  },
  defaultSort: '-createdAt',
  admin: {
    group: t('Movie Database'),
    defaultColumns: ['title', 'format', 'languageVersion', 'isRented', '_status'],
    useAsTitle: 'title',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
  },
  timestamps: true,
  custom: {
    addUrlField: {
      hook: (slug?: string) => `/archive/${slug || ''}`,
    },
    addSlugField: {
      from: 'title',
    },
  },
  hooks: {
    beforeValidate: [
      // set title and slug from movie.title and movie.format
      async ({ data, req }) => {
        if (!req) return data;  // this hook is only used server-side
        if (!data?.movie || !data?.format) return data;
        
        // we'll name all filmprints in fallback language
        const locale = req.payload.config.i18n.fallbackLng as string;
        
        if (!data.title) {
          // create title from movie, format & language version (short)
          const movie = (await req.payload.find({
            collection: 'movies',
            locale,
            where: {
              _id: {
                equals: data.movie,
              },
            },
          })).docs[0] as Movie;
          const format = (await req.payload.find({
            collection: 'formats',
            locale,
            where: {
              _id: {
                equals: data.format,
              },
            },
          })).docs[0] as Format;
          const languageVersion = (await req.payload.find({
            collection: 'languageVersions',
            locale,
            where: {
              _id: {
                equals: data.languageVersion,
              },
            },
          })).docs[0];
          data.title = `${movie.internationalTitle} ${format.name} ${languageVersion.abbreviation}`;
        }

        return data;
      },
    ],
  },
  fields: [
    {
      name: "migrateMovie",
      type: "ui",
      admin: {
        condition: (data) => !data?.movie,
        components: {
          Field: MigrateMovieButton,
        },
      },
    },
    {
      name: 'title',
      label: t('Title'),
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: t('Will be automatically generated if left blank.'),
      },
    },
    {
      name: 'movie',
      label: t('Movie'),
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
      label: t('Film Format'),
      type: 'relationship',
      relationTo: 'formats',
      required: true,
      filterOptions: ({ data }) => (
        { type: { equals: data?.type } }
      ),
    },
    {
      name: 'languageVersion',
      label: t('Language Version'),
      type: 'relationship',
      relationTo: 'languageVersions',
      hasMany: false,
      required: true,
    },
    {
      name: 'isRented',
      label: t('Is rental'),
      type: 'checkbox',
      defaultValue: false,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: t('Details'),
          // admin: {
          //   condition: (data) => !data?.isRented,
          // },
          fields: [
            {
              name: 'rental',
              label: t('Rented by'),
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
              label: t('Carrier'),
              type: 'relationship',
              relationTo: 'carriers',
              admin: {
                condition: (data) => data?.type === 'analog' && !data?.isRented,
              },
              required: true,
            },
            {
              name: 'category',
              label: t('Category'),
              type: 'relationship',
              relationTo: 'categories',
              admin: {
                condition: (data) => data?.type === 'analog' && !data?.isRented,
              },
              required: true,
            },
            {
              name: 'numActs',
              label: t('Number of Acts'),
              type: 'number',
              admin: {
                condition: (data) => data?.type === 'analog' && !data?.isRented,
              },
              required: true,
            },
            {
              name: 'aspectRatio',
              label: t('Aspect Ratio'),
              type: 'relationship',
              relationTo: 'aspectRatios',
              admin: {
                condition: (data) => !data?.isRented,
              },
              required: true,
            },
            {
              name: 'color',
              label: t('Color'),
              type: 'relationship',
              relationTo: 'colors',
              required: true,
              admin: {
                condition: (data) => !data?.isRented,
              },
            },
            {
              name: 'soundFormat',
              label: t('Sound Format'),
              type: 'relationship',
              relationTo: 'soundFormats',
              admin: {
                condition: (data) => !data?.isRented,
              },
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
    },
  ],
};

export default FilmPrints;

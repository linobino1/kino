import payload from 'payload';
import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';
import { slugField, slugFormat } from '../../fields/slug';
import analogDigitalTypeField from './fields';
import options from '../../../app/i18n';

export const FilmPrints: CollectionConfig = {
  slug: 'filmPrints',
  labels: {
    singular: t('Film Print'),
    plural: t('Film Prints'),
  },
  defaultSort: '-createdAt',
  admin: {
    group: t('Film Prints'),
    defaultColumns: ['isRental', 'title'],
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
        if (!data?.movie || !data?.format) return data;
        const locale = req?.locale || options.fallbackLng;

        // create title from movie & format
        const movie = await payload.findByID({
          collection: 'movies',
          id: data.movie,
          locale,
          fallbackLocale: options.fallbackLng,
        });
        const format = await payload.findByID({
          collection: 'formats',
          id: data.format,
          locale,
          fallbackLocale: options.fallbackLng,
        });
        const title = `${movie.originalTitle} ${format.name}`;
        data.title = title;
        data.slug = slugFormat(title);
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'title',
      label: t('Title'),
      type: 'text',
      localized: true,
      unique: true,
      admin: {
        readOnly: true,
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
      name: 'isRental',
      label: t('Is rental'),
      type: 'checkbox',
      defaultValue: false,
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
            condition: (data) => data?.type === 'analog',
          },
          required: true,
        },
      ],
    },
  ],
};

export default FilmPrints;

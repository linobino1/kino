import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';
import { slugField } from '../../fields/slug';
import { getDefaultDocId } from '../../fields/default';
import type { Movie } from 'payload/generated-types';
import { MigrateMovieButton } from '../../MigrateMovie/admin/Button';

const Screenings: CollectionConfig = {
  slug: 'screenings',
  labels: {
    singular: t('Screening'),
    plural: t('Screenings'),
  },
  admin: {
    group: t('Screenings'),
    defaultColumns: ['date', 'time', 'title', '_status'],
    useAsTitle: 'title',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "migrateMovie",
      type: "ui",
      admin: {
        condition: (data) => !data?.featureFilms?.length,
        components: {
          Field: MigrateMovieButton,
        },
      },
    },
    {
      name: 'title',
      label: t('Title'),
      type: 'text',
      localized: true,
      admin: {
        description: t('Leave blank to use the title of the first feature film'),
      },
      hooks: {
        afterRead: [
          // compute title
          async ({ value, data, req }) => {
            if (value || !data?.featureFilms?.length) return value;
            // fetch the first feature films title
            const title = ((await req.payload.find({
              collection: 'filmPrints',
              where: {
                _id: {
                  equals: data.featureFilms[0],
                },
              },
              locale: req.locale,
              depth: 2,
            })).docs[0].movie as Movie).title;
            return title;
          },
        ],
      },
    },
    {
      name: 'group',
      label: t('Group'),
      type: 'relationship',
      relationTo: 'screeningGroups',
      hasMany: false,
      required: true,
      defaultValue: () => getDefaultDocId('screeningGroups'),
    },
    {
      name: 'location',
      label: t('Location'),
      type: 'relationship',
      relationTo: 'locations',
      defaultValue: () => getDefaultDocId('locations'),
    },
    {
      name: 'series',
      label: t('Screening Series'),
      type: 'relationship',
      relationTo: 'screeningSeries',
      hasMany: false,
    },
    {
      name: 'featureFilms',
      label: t('Feature Film(s)'),
      type: 'relationship',
      relationTo: 'filmPrints',
      hasMany: true,
      required: true,
    },
    {
      name: 'supportingFilms',
      label: t('Supporting Film(s)'),
      type: 'relationship',
      relationTo: 'filmPrints',
      hasMany: true,
    },
    slugField('date'),
    {
      name: 'date',
      label: t('Date & Time'),
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: t('adminWarningTimezone'),
      },
    },
    {
      name: 'moderator',
      label: t('Moderator'),
      type: 'text',
      required: false,
    },
    {
      name: 'guest',
      label: t('Guest'),
      type: 'text',
      required: false,
    },
  ],
};

export default Screenings;

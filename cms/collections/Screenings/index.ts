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
      name: 'season',
      label: t('Season'),
      type: 'relationship',
      relationTo: 'screeningSeasons',
      hasMany: false,
      required: true,
      defaultValue: () => fetch(`/api/screeningSeasons/`).then((res) => res.json()).then((res) => res.docs[0].id),
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
      filterOptions: {
        _status: {
          equals: 'published',
        },
      },
    },
    {
      name: 'supportingFilms',
      label: t('Supporting Film(s)'),
      type: 'relationship',
      relationTo: 'filmPrints',
      hasMany: true,
      filterOptions: {
        _status: {
          equals: 'published',
        },
      },
    },
    slugField('date', async ({ data, req }) => {
      // we need the date and at least one feature film
      if (!data || !('date' in data) || !('featureFilms' in data) || !(data.featureFilms.length)) {
        return undefined;
      }
      
      // date is an ISO string, let's just use the first 10 characters (YYYY-MM-DD)
      const date = data.date.substr(0, 10);
      
      // movie is just an id
      const filmPrint = await req.payload.findByID({
        collection: 'filmPrints',
        id: data.featureFilms[0],
        locale: req.locale, 
        depth: 2,
      });
      
      // if we cannot find the movie title we abort
      if (!filmPrint || !(filmPrint.movie)) return undefined;

      // e.g. My Movie-2021-01-01-
      return `${(filmPrint.movie as Movie)?.internationalTitle}-${date}`;
    }),
    {
      name: 'date',
      label: t('Date & Time'),
      type: 'date',
      required: true,
      defaultValue: () => {
        const res = new Date();
        res.setHours(19, 0, 0, 0);
        return res.toISOString();
      },
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

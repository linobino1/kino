import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';
import { slugField } from '../../fields/slug';
import { getDefaultDocId } from '../../fields/default';
import type { Movie } from 'payload/generated-types';

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
  hooks: {
    afterRead: [
      // compute title
      async ({ doc, req }) => {
        if (!doc || doc.title || !doc.featureFilms) return doc;
        console.log('afterRead input', req.locale, doc)
        // fetch the first feature films title
        const title = ((await req.payload.find({
          collection: 'filmPrints',
          where: {
            _id: {
              equals: doc.featureFilms[0],
            },
          },
          locale: req.locale,
          depth: 2,
        })).docs[0].movie as Movie).title;
        // update doc with title in this locale
        doc.title = title;
        console.log('afterRead output', doc)
        return doc;
      },
    ],
  },
  fields: [
    {
      name: 'title',
      label: t('Title'),
      type: 'text',
      localized: true,
      admin: {
        description: t('Leave blank to use the title of the first feature film'),
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
    slugField('title'),
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

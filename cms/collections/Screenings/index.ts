import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';
import { slugField } from '../../fields/slug';
import { getDefaultDocId } from '../../fields/default';

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
      name: 'title',
      label: t('Title'),
      type: 'text',
      localized: true,
      required: true,
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
      label: t('Date'),
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    {
      name: 'time',
      label: t('Time'),
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'timeOnly',
          displayFormat: 'HH:mm',
        },
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

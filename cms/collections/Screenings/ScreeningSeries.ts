import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';
import { slugField } from '../../fields/slug';

const ScreeningSeries: CollectionConfig = {
  slug: 'screeningSeries',
  labels: {
    singular: t('Screening Series'),
    plural: t('Screening Series plural'),
  },
  admin: {
    group: t('Screenings'),
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: t('Name'),
      type: 'text',
      localized: true,
      required: true,
    },
    slugField('name'),
  ],
};

export default ScreeningSeries;

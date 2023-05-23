import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';
import { slugField } from '../../fields/slug';
import pageLayout from '../../fields/pageLayout';

const ScreeningSeries: CollectionConfig = {
  slug: 'screeningSeries',
  labels: {
    singular: t('Screening Series singular'),
    plural: t('Screening Series'),
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
    pageLayout(),
    slugField('name'),
  ],
};

export default ScreeningSeries;

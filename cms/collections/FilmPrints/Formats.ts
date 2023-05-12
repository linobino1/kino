import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';
import analogDigitalTypeField from './fields';

const Formats: CollectionConfig = {
  slug: 'formats',
  labels: {
    singular: t('Film Format'),
    plural: t('Film Formats'),
  },
  admin: {
    group: t('Configuration'),
    defaultColumns: ['type', 'name'],
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    analogDigitalTypeField('type'),
    {
      name: 'name',
      label: t('Name'),
      type: 'text',
      localized: true,
      required: true,
    },
  ],
};

export default Formats;

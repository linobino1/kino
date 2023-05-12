import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';

const Conditions: CollectionConfig = {
  slug: 'conditions',
  labels: {
    singular: t('Condition'),
    plural: t('Conditions'),
  },
  admin: {
    group: t('Configuration'),
    defaultColumns: ['name'],
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
    },
  ],
};

export default Conditions;

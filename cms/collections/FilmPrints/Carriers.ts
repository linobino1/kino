import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';

const Carriers: CollectionConfig = {
  slug: 'carriers',
  labels: {
    singular: t('Carrier'),
    plural: t('Carriers'),
  },
  admin: {
    group: t('Film Prints'),
    defaultColumns: ['type', 'name'],
    useAsTitle: 'name',
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
  ],
};

export default Carriers;

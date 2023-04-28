import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';

const AspectRatios: CollectionConfig = {
  slug: 'aspectRatios',
  labels: {
    singular: t('Aspect Ratio'),
    plural: t('Aspect Ratios'),
  },
  admin: {
    group: t('Film Prints'),
    defaultColumns: ['name'],
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
      required: true,
    },
  ],
};

export default AspectRatios;

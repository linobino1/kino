import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';

const Rentals: CollectionConfig = {
  slug: 'rentals',
  labels: {
    singular: t('Rental'),
    plural: t('Rentals'),
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
      label: t('Name'),
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      label: t('Logo'),
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'credits',
      label: t('Credits'),
      type: 'textarea',
      localized: true,
      required: true,
      defaultValue: ({ locale }: { locale: string}) => t('rentalCreditsDefault')[locale],
      admin: {
        description: t('Edit in all languages!'),
      },
    },
  ],
};

export default Rentals;

import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';

const SoundFormats: CollectionConfig = {
  slug: 'soundFormats',
  labels: {
    singular: t('Sound Format'),
    plural: t('Sound Formats'),
  },
  admin: {
    group: t('Film Prints'),
    defaultColumns: ['name'],
    useAsTitle: 'name',
    hidden: true,
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

export default SoundFormats;

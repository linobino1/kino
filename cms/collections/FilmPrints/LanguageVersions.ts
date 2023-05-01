import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';

const LanguageVersions: CollectionConfig = {
  slug: 'languageVersions',
  labels: {
    singular: t('Language Version'),
    plural: t('Language Versions'),
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

export default LanguageVersions;

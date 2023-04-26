import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';
import { slugField } from '../../fields/slug';

const Genres: CollectionConfig = {
  slug: 'genres',
  labels: {
    singular: t('Genre'),
    plural: t('Genres'),
  },
  admin: {
    group: t('Movie Database'),
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
      localized: true,
      required: true,
      unique: true,
    },
    slugField('name'),
  ],
};

export default Genres;

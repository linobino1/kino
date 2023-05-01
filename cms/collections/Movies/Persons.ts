import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';
import { slugField } from '../../fields/slug';

const Persons: CollectionConfig = {
  slug: 'persons',
  labels: {
    singular: t('Person'),
    plural: t('Persons'),
  },
  admin: {
    group: t('Movie Database'),
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
      required: true,
      unique: true,
    },
    slugField('name'),
  ],
};

export default Persons;

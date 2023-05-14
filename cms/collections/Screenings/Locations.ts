import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';
import { slugField } from '../../fields/slug';
import { defaultField } from '../../fields/default';

const Locations: CollectionConfig = {
  slug: 'locations',
  labels: {
    singular: t('Location'),
    plural: t('Locations'),
  },
  admin: {
    group: t('Configuration'),
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
      localized: true,
      type: 'text',
    },
    slugField('name'),
    defaultField('locations'),
  ],
};

export default Locations;

import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';
import { slugField } from '../../fields/slug';
import { defaultField } from '../../fields/default';

const ScreeningGroups: CollectionConfig = {
  slug: 'screeningGroups',
  labels: {
    singular: t('Group'),
    plural: t('Groups'),
  },
  admin: {
    group: t('Configuration'),
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
    slugField('name'),
    defaultField('screeningGroups'),
  ],
};

export default ScreeningGroups;

import type { CollectionConfig } from 'payload/types';
import { t } from '../../i18n';

const Seasons: CollectionConfig = {
  slug: 'seasons',
  labels: {
    singular: t('Season'),
    plural: t('Seasons'),
  },
  admin: {
    group: t('Configuration'),
    useAsTitle: 'name',
  },
  defaultSort: '-createdAt',
  access: {
    read: () => true,
  },
  custom: {
    addSlugField: {
      from: 'name',
    },
    addUrlField: {
      hook: (slug?: string) => `/seasons/${slug || ''}`,
    },
  },
  fields: [
    {
      name: 'name',
      label: t('Name'),
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'header',
      label: t('Header'),
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
};

export default Seasons;

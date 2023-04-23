import type { GlobalConfig } from 'payload/types';
import { t } from '../i18n';
import { metaField } from '../fields/meta';

export const Site: GlobalConfig = {
  slug: 'site',
  admin: {
    group: t('Config'),
  },
  label: t('Site Config'),
  fields: [
    {
      name: 'title',
      label: t('Title'),
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'logo',
      label: t('Logo'),
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'footerContent',
      label: t('Footer Content'),
      type: 'richText',
      localized: true,
    },
    metaField(t('Global Meta')),
  ],
};

export default Site;

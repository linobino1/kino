import type { GlobalConfig } from 'payload/types';
import { t } from '../i18n';
import { metaField } from '../fields/meta';

export const Site: GlobalConfig = {
  slug: 'site',
  admin: {
    group: t('System'),
  },
  label: t('Site Configuration'),
  fields: [
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

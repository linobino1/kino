import type { Field } from 'payload/types';
import { t } from '../i18n';

export const metaField = (label: Record<string, string>): Field => ({
  name: 'meta',
  label,
  type: 'group',
  fields: [
    {
      name: 'description',
      label: t('Description'),
      localized: true,
      type: 'textarea',
    },
    {
      name: 'keywords',
      label: t('Keywords'),
      type: 'text',
    },
  ],
});

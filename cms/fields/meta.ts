import type { Field } from 'payload/types';
import { t } from '../i18n';

export const metaField = (label: Record<string, string>): Field => ({
  name: 'meta',
  label,
  type: 'group',
  fields: [
    {
      name: 'title',
      label: t('Title'),
      localized: true,
      type: 'text',
    },
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

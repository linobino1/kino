import type { Field } from 'payload/types';
import slugify from 'slugify';
import { t } from '../i18n';

export const slugFormat = (s: string): string => {
  if (!s) return s;
  return slugify(s, {
    lower: true,
  });
};

export const slugField = (field: string): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: t('Will be automatically generated if left blank.'),
  },
  hooks: {
    beforeValidate: [
      ({ value, originalDoc, data }) => {
        if (typeof value === 'string' && value.length > 0) {
          return slugFormat(value);
        }
        const fieldData = (originalDoc && originalDoc[field]) || (data && data[field]);

        if (fieldData && typeof fieldData === 'string') {
          return slugFormat(fieldData);
        }

        return value;
      }
    ],
  },
});

import type { Field } from 'payload/types';
import slugify from 'slugify';

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
  },
  hooks: {
    beforeValidate: [
      ({ value, originalDoc, data }) => {
        if (typeof value === 'string') {
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

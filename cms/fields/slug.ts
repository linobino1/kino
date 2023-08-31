import type { FieldHookArgs } from 'payload/dist/fields/config/types';
import type { Field } from 'payload/types';
import slugify from 'slugify';
import { t } from '../i18n';

export const slugFormat = (s: string): string => {
  if (!s) return s;
  return slugify(s, {
    lower: true,
  });
};

export interface slugGeneratorArgs extends FieldHookArgs {
  field: string;
}
export interface slugGenerator {
  (args: slugGeneratorArgs): Promise<string | undefined>;
}

/**
 * default slug generator (uses the given fields value)
 * @returns unformatted string that will be formatted by slugFormat
 */
export const defaultGenerator: slugGenerator = async ({
  originalDoc, data, field,
}) => {
  const res = (originalDoc && originalDoc[field]) || (data && data[field]);
  return typeof res === 'string' ? res : undefined;
}

export const slugField = (field: string, customGenerator?: slugGenerator): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  label: t('Slug'),
  admin: {
    position: 'sidebar',
    description: t('Will be automatically generated if left blank.'),
  },
  hooks: {
    beforeValidate: [
      async (props) => {
        const { value } = props;

        // if slug field is not empty, use it
        if (typeof value === 'string' && value.length > 0) {
          return slugFormat(value);
        }
        
        // otherwise, use the default or custom slug generator
        const res = await (customGenerator || defaultGenerator)({field, ...props});

        // if the generator returns a string, format it, otherwise return the original value
        return res ? slugFormat(res) : value;
      }
    ],
  },
});

import type { FieldHook } from 'payload/dist/fields/config/types';
import type { Field as FieldType } from 'payload/types';
// import { Field } from '../admin/Field';

export const UrlField = (hook: FieldHook): FieldType => ({
  name: 'url',
  type: 'text',
  hooks: {
    beforeChange: [
      ({ siblingData }) => {
        // ensures data is not stored in DB
        delete siblingData['url'];
      },
    ],
    afterRead: [
      hook,
    ],
  },
  // required: true, and validate: () => true, make typescript know that there is always a string value in this field
  required: true,
  validate: () => true,
  admin: {
    readOnly: true,
    position: 'sidebar',
    components: {
      // Field,
    },
  },
});

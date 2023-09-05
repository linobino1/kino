import type { FieldHook } from 'payload/dist/fields/config/types';
import type { Field } from 'payload/types';

export const urlField = (hook: FieldHook): Field => ({
  name: 'url',
  type: 'text',
  hidden: true,
  hooks: {
    beforeChange: [
      ({ siblingData }) => {
        // ensures data is not stored in DB
        delete siblingData['url']
      }
    ],
    afterRead: [
      hook,
    ],
  },
  // required: true, and validate: () => true, make typescript know that there is always a string value in this field
  required: true,
  validate: () => true,
});

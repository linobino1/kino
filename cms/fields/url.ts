import type { FieldHook } from 'payload/dist/fields/config/types';
import type {
  Field } from 'payload/types';
import type {
  Post,
  StaticPage,
  Screening,
  ScreeningSery,
  FilmPrint,
} from 'payload/generated-types';

// each collection that has a url field must be added to this type
export type LinkableCollection = Post | StaticPage | Screening | ScreeningSery | FilmPrint;

// each collection that has a url field must be added to this array
export const LinkableCollectionSlugs = [
  'posts',
  'staticPages',
  'screenings',
  'screeningSeries',
  'filmPrints',
];

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

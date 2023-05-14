import type { Field } from 'payload/types';
import { t } from '../i18n';

/**
 * a helper function to get the id of the default doc for a collection with a 'default' field
 * @param collection collection slug
 * @returns string | null the id of the default doc for the collection or null if none is set
 */
export const getDefaultDocId = async (collection: string): Promise<string> => {
  const res = await fetch(`/api/${collection}/?where[default][equals]=true`).then((res) => res.json());
  return res.docs.length ? res.docs[0].id : null;
}

/**
 * a checkbox to mark a doc as default for a collection
 */
export const defaultField = (collection: string): Field => ({
  name: 'default',
  type: 'checkbox',
  label: t('is default for this collection'),
  hooks: {
    beforeChange: [
      async ({ req, value }) => {
        // unset previous default doc to false
        if (value) {
          // @ts-ignore collection must be a valid collection and obviously has a 'default' field
          await req.payload.update({
            collection,
            where: {
              default: {
                equals: true,
              },
            },
            data: {
              default: false,
            },
          });
        }
        return value
      }
    ],
  },
});

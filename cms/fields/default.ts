import type { Field } from 'payload/types';
import { t } from '../i18n';

/**
 * a helper function to get the id of the default doc for a collection with a 'default' field
 * @param collection collection slug
 * @returns string | undefined the id of the default doc for the collection or null if none is set
 */
export const getDefaultDocId = async (collection: string): Promise<string | undefined> => {
  try {
    return (await fetch(`/api/${collection}/?where[default][equals]=true`).then((res) => res.json())).docs[0].id;
  } catch (e) {
    return undefined;
  }
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
          await req.payload.update({
            // @ts-ignore collection must be a valid collection slug
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

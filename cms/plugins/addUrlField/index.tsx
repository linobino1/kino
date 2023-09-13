import React from 'react';
import type { Config, Plugin } from 'payload/config';
import type { FieldHookArgs } from 'payload/dist/fields/config/types';
import { useField } from 'payload/components/forms';
import { useTranslation } from 'react-i18next';

/**
 * this plugin adds a url field to a collection if you add the following to the collection config:
 * custom: {
 *  addUrlField: {
 *   hook: (slug: string) => `my/path/${slug}`,
 * },
 */
export const addUrlField: Plugin = (incomingConfig: Config): Config => {
  // Spread the existing config
  const config: Config = {
    ...incomingConfig,
    // @ts-ignore
    collections: [
      ...incomingConfig.collections?.map((collection) => collection.custom?.addUrlField ? {
        ...collection,
        fields: [
          ...collection.fields,
          {
            name: 'url',
            type: 'text',
            hooks: {
              beforeChange: [
                ({ siblingData }: FieldHookArgs): void => {
                  // ensures data is not stored in DB
                  delete siblingData['url'];
                },
              ],
              afterRead: [
                ({ siblingData }: FieldHookArgs): string => collection.custom?.addUrlField.hook(siblingData.slug) || '',
              ],
            },
            admin: {
              position: 'sidebar',
              readOnly: true,
              components: {
                Field: () => {
                  const { t } = useTranslation();
                  const { value: slug } = useField<string>({ path: 'slug' });
                  const url = collection.custom?.addUrlField.hook(slug);
                  return (
                    <div className='field-type text'>
                      <label className='field-label'>{t('URL Frontend')}</label>
                      <a
                        href={url}
                        target='_blank'
                        rel='noreferrer'
                      >{url}</a>
                    </div>
                  )
                },
              }
            },
          },
        ],
      } : collection) || [],
    ],
  };

  return config;
};

export default addUrlField;
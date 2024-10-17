import React from 'react'
import type { Config, Plugin, FieldHookArgs } from 'payload'

/**
 * this plugin adds a url field to a collection if you add the following to the collection config:
 * custom: {
 *  addUrlField: {
 *   hook: (slug?: string) => `my/path/${slug || ''}`,
 * },
 */
export const addUrlField: Plugin = (incomingConfig: Config): Config => {
  // Spread the existing config
  const config: Config = {
    ...incomingConfig,
    // @ts-ignore
    collections: [
      ...(incomingConfig.collections?.map((collection) =>
        collection.custom?.addUrlField
          ? {
              ...collection,
              admin: {
                ...collection.admin,
                enableRichTextLink: true,
                enableRichTextRelationship: true,
              },
              fields: [
                ...collection.fields,
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  validate: () => true,
                  hooks: {
                    beforeChange: [
                      ({ siblingData }: FieldHookArgs): string => {
                        const relativeUrl =
                          collection.custom?.addUrlField.hook(siblingData.slug) || ''
                        return `${process.env.PAYLOAD_PUBLIC_SERVER_URL || ''}${relativeUrl || ''}`
                      },
                    ],
                  },
                  admin: {
                    position: 'sidebar',
                    readOnly: true,
                    components: {
                      Field: '/components/UrlField',
                    },
                  },
                },
              ],
            }
          : collection,
      ) || []),
    ],
  }

  return config
}

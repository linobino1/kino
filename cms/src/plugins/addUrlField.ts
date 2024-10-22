import type { Config, Plugin, FieldHookArgs } from 'payload'

/**
 * this plugin adds a url field to a collection if you add the following to the collection config:
 * custom: {
 *  addUrlField: {
 *   hook: (slug?: string) => `/my/path/${slug || ''}`,
 * },
 */
export const addUrlField: Plugin = (incomingConfig: Config): Config => {
  // Spread the existing config
  const config: Config = {
    ...incomingConfig,
    collections: [
      ...(incomingConfig.collections ?? []).map((collection) => ({
        ...collection,
        admin: {
          ...collection.admin,
          enableRichTextLink: true,
          enableRichTextRelationship: true,
        },
        fields: [
          ...collection.fields.concat([
            {
              name: 'url',
              type: 'text',
              required: true,
              validate: () => true as const,
              hooks: {
                beforeChange: [
                  ({ siblingData }: FieldHookArgs): string => {
                    return collection.custom?.addUrlField.hook(siblingData.slug) || ''
                  },
                ],
              },
              admin: {
                position: 'sidebar',
                readOnly: true,
                components: {
                  Field: '@/components/UrlField',
                },
              },
            },
          ]),
        ],
      })),
    ],
  }

  return config
}

import { env } from '@app/util/env/backend.server'
import type { Config, Plugin, FieldHookArgs, CollectionSlug } from 'payload'

// each collection that has a url field must be added to this array
export const LinkableCollectionSlugs: CollectionSlug[] = [
  'posts',
  'pages',
  'events',
  'screeningSeries',
  'filmPrints',
  'seasons',
]

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
      ...(incomingConfig.collections ?? []).map((collection) =>
        collection.custom?.addUrlField
          ? {
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
                    label: 'URL',
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
                        Field: {
                          clientProps: {
                            baseUrl: env.FRONTEND_URL,
                          },
                          path: '/components/UrlField#UrlField',
                        },
                      },
                    },
                  },
                ]),
              ],
            }
          : collection,
      ),
    ],
  }

  return config
}

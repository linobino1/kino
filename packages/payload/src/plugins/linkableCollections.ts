import type { Config, Plugin, CollectionSlug } from 'payload'
import { linkableCollectionSlugs } from '@app/util/routes'

export const LinkableCollectionSlugs = linkableCollectionSlugs as CollectionSlug[]
const linkableCollectionSlugSet = new Set<string>(linkableCollectionSlugs)

/** Enable internal rich-text links and relationships only for collections with public routes. */
export const linkableCollections: Plugin = (incomingConfig: Config): Config => ({
  ...incomingConfig,
  collections: (incomingConfig.collections ?? []).map((collection) => {
    const isLinkable = linkableCollectionSlugSet.has(collection.slug)
    return {
      ...collection,
      admin: {
        ...(!isLinkable && {
          enableRichTextLink: false,
          enableRichTextRelationship: false,
        }),
        ...collection.admin,
        ...(isLinkable && {
          enableRichTextLink: true,
          enableRichTextRelationship: true,
        }),
      },
    }
  }),
})

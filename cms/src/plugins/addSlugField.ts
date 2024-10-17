import type { Config, Plugin, Field, CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import slugify from 'slugify'
import { t } from '@/i18n'

export const slugFormat = (s: string): string => {
  if (!s) return s
  return slugify(s.replace('ä', 'ae').replace('ö', 'oe').replace('Ü', 'ue').replace('ß', 'ss'), {
    lower: true,
    strict: true,
  })
}

export type slugGeneratorArgs = Parameters<CollectionBeforeChangeHook>[0] & {
  from?: string
}

export interface slugGenerator {
  (args: slugGeneratorArgs): Promise<string | undefined>
}

/**
 * default slug generator (uses the given fields value)
 * @returns unformatted string that will be formatted by slugFormat
 */
const defaultGenerator: slugGenerator = async ({ data, originalDoc, from }) => {
  if (!from) throw new Error('from is required in addSlugField config if no generator is given')
  const res = (originalDoc && originalDoc[from]) || (data && data[from])
  return typeof res === 'string' ? res : undefined
}

const hook =
  (collection: CollectionConfig): CollectionBeforeChangeHook =>
  async (props) => {
    const { data } = props

    // do nothing if the slug is already set
    if (!data || data.slug) return data

    // generate raw slug
    const generator: slugGenerator = collection.custom?.addSlugField?.generator || defaultGenerator
    const raw = await generator({
      ...props,
      from: collection.custom?.addSlugField?.from,
    })

    // slugify raw slug
    const slug = raw ? slugFormat(raw) : undefined

    data.slug = slug

    return data
  }

const field: Field = {
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  label: t('Slug'),
  admin: {
    position: 'sidebar',
    description: t('Will be automatically generated if left blank.'),
  },
}
/**
 * this plugin adds a url field to a collection if you add the following to the collection config:
 *
 * custom: {
 *  addSlugField: {
 *   generator: (args: slugGeneratorArgs) => Promise<string | undefined>,
 *   from: 'title',
 * },
 * fields: [
 *  {
 *   name: 'title',
 *   ...
 *  },
 *
 */
export const addSlugField: Plugin = (incomingConfig: Config): Config => {
  // Spread the existing config
  const config: Config = {
    ...incomingConfig,
    // @ts-ignore
    collections: [
      ...(incomingConfig.collections?.map((collection) =>
        collection.custom?.addSlugField
          ? {
              ...collection,
              hooks: {
                ...collection.hooks,
                beforeChange: [...(collection.hooks?.beforeChange || []), hook(collection)],
              },
              fields: [...collection.fields, field],
            }
          : collection,
      ) || []),
    ],
  }

  return config
}

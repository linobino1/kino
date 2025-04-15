import slugify from 'slugify'

type SlugifyOptions = {
  locale?: string
  lower?: boolean
  strict?: boolean
  replacement?: string
}

export const formatSlug = (val: any, options?: SlugifyOptions): string =>
  typeof val === 'string'
    ? slugify(val, {
        locale: options?.locale ?? 'de',
        lower: options?.lower ?? true,
        strict: options?.strict ?? true,
        replacement: options?.replacement ?? '-',
      })
    : ''

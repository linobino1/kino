import slugify from 'slugify'

export const formatSlug = (val: string): string =>
  slugify(val, {
    locale: 'de',
    lower: true,
    strict: true,
  })

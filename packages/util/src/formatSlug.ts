import slugify from 'slugify'

export const formatSlug = (val: any): string =>
  typeof val === 'string'
    ? slugify(val, {
        locale: 'de',
        lower: true,
        strict: true,
      })
    : ''

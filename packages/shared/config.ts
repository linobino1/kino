export const siteTitle = 'Kino im Blauen Salon'

export const locales = ['de', 'en'] as const
export const defaultLocale = 'de'

export type Locale = (typeof locales)[number]

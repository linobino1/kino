import { defaultLocale, type Locale } from '@app/i18n'
import { formatInTimeZone } from 'date-fns-tz'
import { enUS, de } from 'date-fns/locale'
import { timezone } from './config'

const localeMap: Record<Locale, any> = {
  de: de,
  en: enUS,
}

export const formatDate = (
  date: string | Date,
  formatStr: string,
  locale: Locale = defaultLocale,
) => {
  return formatInTimeZone(typeof date === 'string' ? new Date(date) : date, timezone, formatStr, {
    locale: localeMap[locale],
  })
}

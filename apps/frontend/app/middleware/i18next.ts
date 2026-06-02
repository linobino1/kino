import type { translations } from '@app/i18n/translations'
import 'i18next'
import { initReactI18next } from 'react-i18next'
import { defaultLocale, locales } from '@app/i18n'
import { createI18nextMiddleware } from 'remix-i18next/middleware'
import { i18nCookie } from '~/cookies'
import i18nextConfig from '~/i18n'

export const [i18nextMiddleware, getLocale, getInstance] = createI18nextMiddleware({
  detection: {
    supportedLanguages: [...locales],
    fallbackLanguage: defaultLocale,
    cookie: i18nCookie,
    async findLocale(request) {
      const language = new URL(request.url).pathname.split('/').at(1)
      return language ?? defaultLocale
    },
  },
  i18next: i18nextConfig,
  plugins: [initReactI18next],
})

// This adds type-safety to the `t` function
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: typeof translations.de
  }
}

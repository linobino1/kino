import { HydratedRouter } from 'react-router/dom'
import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import i18n from './i18n'
import i18next from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getInitialNamespaces } from 'remix-i18next/client'
import { translations } from '@app/i18n/translations'

async function hydrate() {
  await i18next
    .use(initReactI18next) // Tell i18next to use the react-i18next plugin
    .use(LanguageDetector) // Setup a client-side language detector
    .init({
      ...i18n, // spread the configuration
      ns: getInitialNamespaces(),
      resources: {
        de: {
          common: translations.de.common,
          auth: translations.de.auth,
        },
        en: {
          common: translations.en.common,
          auth: translations.en.auth,
        },
      },
      detection: {
        // Here only enable htmlTag detection, we'll detect the language only
        // server-side with remix-i18next, by using the `<html lang>` attribute
        // we can communicate to the client the language detected server-side
        order: ['htmlTag'],
        // Because we only use htmlTag, there's no reason to cache the language
        // on the browser, so we disable it
        caches: [],
      },
    })

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <HydratedRouter />
      </I18nextProvider>,
    )
  })
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate)
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1)
}

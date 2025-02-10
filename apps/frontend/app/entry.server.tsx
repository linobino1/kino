import { PassThrough } from 'stream'
import { createReadableStreamFromReadable, type EntryContext } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { isbot } from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'
import { createInstance } from 'i18next'
import i18next from './i18next.server'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import i18n from './i18n'
import { translations } from '@app/i18n/translations'
import { getRequestLanguage } from './util/i18n/getRequestLanguage'
import { getUrlLanguage } from './util/i18n/getUrlLanguage'

const ABORT_DELAY = 5000

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const callbackName = isbot(request.headers.get('user-agent')) ? 'onAllReady' : 'onShellReady'

  const instance = createInstance()
  const lng = getUrlLanguage(request) ?? getRequestLanguage(request)
  const ns = i18next.getRouteNamespaces(remixContext)

  await instance.use(initReactI18next).init({
    ...i18n,
    lng,
    ns,
    resources: {
      de: { common: translations.de.common, auth: translations.de.auth },
      en: { common: translations.en.common, auth: translations.en.auth },
    },
  })

  return new Promise((resolve, reject) => {
    let didError = false

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={instance}>
        <RemixServer context={remixContext} url={request.url} />
      </I18nextProvider>,
      {
        [callbackName]: () => {
          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)
          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          )

          pipe(body)
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onError(error: unknown) {
          didError = true

          console.error(error)
        },
      },
    )

    setTimeout(abort, ABORT_DELAY)
  })
}

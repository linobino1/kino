import { PassThrough } from 'node:stream'
import { createReadableStreamFromReadable } from '@react-router/node'
import { isbot } from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'
import { ServerRouter } from 'react-router'
import type { AppLoadContext, EntryContext } from 'react-router'
import type { RenderToPipeableStreamOptions, RenderToReadableStreamOptions } from 'react-dom/server'
import { createInstance } from 'i18next'
import i18next from './i18next.server'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import i18n from './i18n'
import { translations } from '@app/i18n/translations'
import { getRequestLanguage } from './util/i18n/getRequestLanguage'
import { getUrlLanguage } from './util/i18n/getUrlLanguage'

export const streamTimeout = 5_000

export type RenderOptions = {
  [K in keyof RenderToReadableStreamOptions &
    keyof RenderToPipeableStreamOptions]?: RenderToReadableStreamOptions[K]
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext?: AppLoadContext,
  options?: RenderOptions,
): Promise<Response> {
  const instance = createInstance()
  const lng = getUrlLanguage(request) ?? getRequestLanguage(request)
  const ns = i18next.getRouteNamespaces(routerContext)

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
    let shellRendered = false
    const userAgent = request.headers.get('user-agent')

    // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
    // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
    const readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode ? 'onAllReady' : 'onShellReady'

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={instance}>
        <ServerRouter context={routerContext} url={request.url} nonce={options?.nonce} />
      </I18nextProvider>,
      {
        ...options,

        [readyOption]() {
          shellRendered = true
          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          )

          pipe(body)
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onError(error: unknown) {
          responseStatusCode = 500
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error)
          }
        },
      },
    )

    // Abort the rendering stream after the `streamTimeout` so it has time to
    // flush down the rejected boundaries
    setTimeout(abort, streamTimeout + 1000)
  })
}

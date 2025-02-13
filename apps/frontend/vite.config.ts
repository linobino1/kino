import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import UnoCSS from 'unocss/vite'
import { customRoutesConfig } from './app/customRoutesConfig'

declare module '@remix-run/node' {
  // this is a temporary workaround for getting proper types with the v3_singleFetch future flag
  interface Future {
    v3_singleFetch: true
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: true,
        v3_routeConfig: true,
      },
    }),
    tsconfigPaths(),
    UnoCSS(),
  ],
  ssr: {
    noExternal: [
      'remix-custom-routes',
      'remix-i18next',
      'payload',
      '@payloadcms/richtext-lexical',
    ].concat(
      // not sure why this is necessary, but deployments on vercel throw runtime error if @payloadcms/db-mongodb is noExternal
      process.env.NODE_ENV === 'development' ? ['@payloadcms/db-mongodb'] : [],
    ),
  },
})

import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import UnoCSS from 'unocss/vite'
import { customRoutesConfig } from './app/customRoutesConfig'

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: true,
      },
      routes: customRoutesConfig,
    }),
    tsconfigPaths(),
    UnoCSS(),
  ],
  ssr: {
    noExternal: ['remix-custom-routes', 'remix-i18next', 'payload'],
  },
})

import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), UnoCSS()],
  optimizeDeps: {
    exclude: [
      '@app/payload',
      'remix-i18next',
      'payload',
      '@payloadcms/richtext-lexical',
      '@payloadcms/db-mongodb',
    ],
  },
  ssr: {
    noExternal: ['remix-i18next', 'payload', '@payloadcms/richtext-lexical'],
  },
})

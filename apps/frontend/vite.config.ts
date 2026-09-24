import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [reactRouter(), tailwindcss()],
  optimizeDeps: {
    exclude: [
      '@app/payload',
      'remix-i18next',
      'payload',
      '@payloadcms/richtext-lexical',
      '@payloadcms/db-mongodb',
    ],
  },
  build: {
    rollupOptions: {
      external: ['@payloadcms/richtext-lexical'],
    },
  },
  ssr: {
    // pdfkit must be externalized, refer to this issue https://github.com/diegomura/react-pdf/issues/3570
    external: ['pdfkit'],
    noExternal:
      command === 'build' ? true : ['remix-i18next', 'payload', '@payloadcms/richtext-lexical'],
  },
  server: {
    allowedHosts: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
}))

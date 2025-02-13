import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import UnoCSS from 'unocss/vite'
import path from 'path'

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), UnoCSS()],
  optimizeDeps: {
    exclude: ['@app/payload'],
  },
  resolve:
    process.NODE_ENV === 'development'
      ? {
          alias: {
            'file-type': path.resolve(__dirname, '../../node_modules/file-type/index.js'),
          },
        }
      : {},
  ssr: {
    noExternal: ['remix-i18next', 'payload', '@payloadcms/richtext-lexical'].concat(
      // not sure why this is necessary, but deployments on vercel throw runtime error if @payloadcms/db-mongodb is noExternal
      process.env.NODE_ENV === 'development' ? ['@payloadcms/db-mongodb'] : [],
    ),
  },
})

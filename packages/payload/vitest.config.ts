import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    setupFiles: ['./src/tests/globalSetup.ts'],
  },
  plugins: [tsconfigPaths()],
})

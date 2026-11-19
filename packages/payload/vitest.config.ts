import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./src/tests/globalSetup.ts'],
    fileParallelism: false,
    testTimeout: 10000,
  },
  resolve: {
    tsconfigPaths: true,
  },
})

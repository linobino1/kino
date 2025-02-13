import type { RouteConfig } from '@react-router/dev/routes'
import { layout, route, prefix } from '@react-router/dev/routes'
import { flatRoutes } from '@react-router/fs-routes'

export default [
  route('/:lang?/test', './new-routes/test.tsx'),
  ...prefix('/:lang?', [...(await flatRoutes({ rootDirectory: 'routes' }))]),
] satisfies RouteConfig

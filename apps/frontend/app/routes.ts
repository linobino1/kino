import type { RouteConfig } from '@remix-run/route-config'
import { layout, route, prefix } from '@remix-run/route-config'
import { flatRoutes } from '@remix-run/fs-routes'

export default [
  ...prefix('/:lang?', [...(await flatRoutes({ rootDirectory: 'routes' }))]),
] satisfies RouteConfig

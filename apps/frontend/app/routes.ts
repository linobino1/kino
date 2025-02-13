import type { RouteConfig } from '@react-router/dev/routes';
import { layout, route, prefix } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';

export default [
  ...prefix('/:lang?', [...(await flatRoutes({ rootDirectory: 'routes' }))]),
] satisfies RouteConfig

import type { RouteConfig } from '@react-router/dev/routes'
import { index, layout, route, prefix } from '@react-router/dev/routes'
import { localizedRoutePrefix, routePaths } from '@app/util/routes'

export default [
  route('/health', './routes/health.ts'),
  ...prefix('/api', [
    route('/events-block-endpoint', './routes/api/events-block-endpoint.ts'),
    route('/newsletter-signup', './routes/api/newsletter-signup.ts'),
    route('/kronolith.html', './routes/api/kronolith-iframe.ts'),
    route('/ics', './routes/api/ics.ts'),
  ]),
  route('/press-releases/:id.pdf', './routes/press-releases/route.tsx'),
  route('/press-releases/:id.zip', './routes/press-releases/zip.ts'),
  layout('./routes/localized/_layout.tsx', [
    layout('./routes/localized/auth/_layout.tsx', [
      ...prefix(`${localizedRoutePrefix}/auth`, [
        route('/me', './routes/localized/auth/me.tsx'),
        route('/signin', './routes/localized/auth/signin.tsx'),
        route('/signup', './routes/localized/auth/signup.tsx'),
        route('/signout', './routes/localized/auth/signout.ts'),
        route('/forgot-password', './routes/localized/auth/forgot-password.tsx'),
        route('/reset-password', './routes/localized/auth/reset-password.tsx'),
        route('/verify-email', './routes/localized/auth/verify-email.tsx'),
      ]),
    ]),
    layout('./routes/localized/main/_layout.tsx', [
      ...prefix(localizedRoutePrefix, [
        index('./routes/localized/main/index.tsx'),
        route(routePaths.page, './routes/localized/main/page.tsx'),
        route(routePaths.events, './routes/localized/main/events.index.tsx'),
        route(routePaths.event, './routes/localized/main/events.detail.tsx'),
        route(routePaths.news, './routes/localized/main/news.index.tsx'),
        route(routePaths.post, './routes/localized/main/news.detail.tsx'),
        route(routePaths.filmPrints, './routes/localized/main/filmprints.index.tsx'),
        route(routePaths.filmPrint, './routes/localized/main/filmprints.detail.tsx'),
        route(routePaths.seasons, './routes/localized/main/seasons.index.tsx'),
        route(routePaths.season, './routes/localized/main/seasons.detail.tsx'),
        route(routePaths.eventSeries, './routes/localized/main/event-series.detail.tsx'),
        route(routePaths.hfgArchive, './routes/localized/main/hfg-archive.index.tsx'),
        route(routePaths.hfgArchiveFilmPrint, './routes/localized/main/hfg-archive.detail.tsx'),
      ]),
    ]),
  ]),
  route('robots.txt', './routes/robots.txt.ts'),
  route('sitemap.xml', './routes/sitemap.xml.ts'),
  route('*', './routes/catchall.tsx'),
  route('pool-stats', './routes/pool-stats.ts'),
] satisfies RouteConfig

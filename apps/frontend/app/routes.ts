import type { RouteConfig } from '@react-router/dev/routes'
import { index, layout, route, prefix } from '@react-router/dev/routes'

export default [
  route('/favicon.ico', './routes/favicon.ts'),
  ...prefix('/api', [
    route('/events-block-endpoint', './routes/api/events-block-endpoint.ts'),
    route('/listmonk-wakeup', './routes/api/listmonk-wakeup.ts'),
    route('/newsletter-signup', './routes/api/newsletter-signup.ts'),
    route('/kronolith.html', './routes/api/kronolith-iframe.ts'),
  ]),
  layout('./routes/localized/_layout.tsx', [
    layout('./routes/localized/auth/_layout.tsx', [
      ...prefix('/:lang?/auth', [
        route('/me', './routes/localized/auth/me.tsx'),
        route('/signin', './routes/localized/auth/signin.tsx'),
        route('/signup', './routes/localized/auth/signup.tsx'),
        route('/forgot-password', './routes/localized/auth/forgot-password.tsx'),
        route('/reset-password', './routes/localized/auth/reset-password.tsx'),
        route('/verify-email', './routes/localized/auth/verify-email.tsx'),
      ]),
    ]),
    layout('./routes/localized/main/_layout.tsx', [
      ...prefix('/:lang?', [
        index('./routes/localized/main/index.tsx'),
        route('/:slug', './routes/localized/main/page.tsx'),
        route('/events', './routes/localized/main/events.index.tsx'),
        route('/events/:slug', './routes/localized/main/events.detail.tsx'),
        route('/news', './routes/localized/main/news.index.tsx'),
        route('/news/:slug', './routes/localized/main/news.detail.tsx'),
        route('/filmprints', './routes/localized/main/filmprints.index.tsx'),
        route('/filmprints/:slug', './routes/localized/main/filmprints.detail.tsx'),
        route('/seasons', './routes/localized/main/seasons.index.tsx'),
        route('/seasons/:slug', './routes/localized/main/seasons.detail.tsx'),
        route('/event-series/:slug', './routes/localized/main/event-series.detail.tsx'),
        route('/hfg-archive', './routes/localized/main/hfg-archive.index.tsx'),
        route('/hfg-archive/:slug', './routes/localized/main/hfg-archive.detail.tsx'),
      ]),
    ]),
  ]),
] satisfies RouteConfig

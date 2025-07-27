import { locales } from '@app/i18n'
import { env } from '@app/util/env/frontend.server'
import { href } from 'react-router'

export const loader = () => {
  const sitemap = href('/sitemap.xml')
  const robotText = `
User-agent: *
Allow: /
Disallow: /api/
Disallow: /press-releases/
${locales.map((locale) => `Disallow: /${locale}/auth/`).join('\n')}

Sitemap: ${env.FRONTEND_URL}${sitemap}
`

  return new Response(robotText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}

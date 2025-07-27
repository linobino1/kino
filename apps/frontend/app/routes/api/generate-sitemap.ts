import { env } from '@app/util/env/frontend.server'
import { getPayload } from '~/util/getPayload.server'
import type { Route } from './+types/generate-sitemap'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${env.CRON_SECRET}` && env.NODE_ENV !== 'development') {
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = await getPayload()

  // we need to pass on the token to the payload requests in order to authorize them
  await payload.jobs.queue({
    task: 'generateSitemap',
    input: {},
  })
  await payload.jobs.run()

  return {
    ok: true,
  }
}

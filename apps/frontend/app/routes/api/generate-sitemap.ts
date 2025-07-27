import { env } from '@app/util/env/frontend.server'
import { getPayload, configPromise } from '~/util/getPayload.server'
import type { Route } from './+types/generate-sitemap'
import { createPayloadRequest } from 'payload'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${env.CRON_SECRET}` && env.NODE_ENV !== 'development') {
    return new Response('Unauthorized', { status: 401 })
  }

  console.log('incoming auth header:', authHeader)

  const payload = await getPayload()

  // we need to pass on the token to the payload requests in order to authorize them
  const headers = new Headers(request.headers)
  headers.set('Authorization', authHeader || '')
  const req = await createPayloadRequest({
    config: await configPromise,
    request: {
      ...request,
      url: request.url.toString(),
      headers,
    },
  })

  await payload.jobs.queue({
    task: 'generateSitemap',
    input: {},
    req,
  })
  await payload.jobs.run({
    req,
  })

  return {
    ok: true,
  }
}

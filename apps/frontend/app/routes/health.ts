import type { Route } from './+types/health'

export const loader = async (_args: Route.LoaderArgs) =>
  new Response('OK', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })

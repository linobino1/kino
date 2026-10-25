import type { MiddlewareFunction } from 'react-router'

type TimingEntry = {
  name: string
  duration: number
}

const timingsByRequest = new WeakMap<Request, TimingEntry[]>()
const isServerTimingEnabled = () => process.env.ENABLE_SERVER_TIMING_HEADER === 'true'

export async function measureServerTiming<Value>(
  request: Request,
  name: string,
  operation: () => Promise<Value>,
): Promise<Value> {
  if (!isServerTimingEnabled()) return operation()

  const timings = timingsByRequest.get(request)
  if (!timings) return operation()

  const startedAt = performance.now()
  try {
    return await operation()
  } finally {
    timings.push({ name, duration: performance.now() - startedAt })
  }
}

export const serverTimingMiddleware: MiddlewareFunction = async ({ request }, next) => {
  if (!isServerTimingEnabled()) return next()

  const timings: TimingEntry[] = []
  timingsByRequest.set(request, timings)
  const startedAt = performance.now()
  const response = await next()

  if (!(response instanceof Response)) return response

  const headers = new Headers(response.headers)
  const entries = [
    ...timings.map(({ name, duration }) => `${name};dur=${duration.toFixed(1)}`),
    `loaders;dur=${(performance.now() - startedAt).toFixed(1)}`,
  ]
  headers.append('Server-Timing', entries.join(', '))

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

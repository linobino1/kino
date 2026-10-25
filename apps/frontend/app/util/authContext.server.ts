import type { User } from '@app/types/payload'
import { createContext, type MiddlewareFunction } from 'react-router'
import { getPayload } from './getPayload.server'
import { measureServerTiming } from './serverTiming.server'

export const userContext = createContext<() => Promise<User | null>>()

export const authMiddleware: MiddlewareFunction = async ({ request, context }, next) => {
  let user: Promise<User | null> | undefined
  context.set(userContext, () => {
    user ??= measureServerTiming(request, 'auth', async () => {
      const payload = await getPayload()
      return (await payload.auth(request)).user
    })
    return user
  })

  return next()
}

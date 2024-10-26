/**
 * this is not a reliable way to verify the user!!!
 * But it's giving a probably correct answer in no time. We use this to check if we can use cached data or not.
 */
import { User } from '@/payload-types'

const g = global as unknown as {
  __user: User | null
}

export const setCachedUser = (user: User | null) => {
  g.__user = user
}

export const getCachedUser = (): User | null => {
  return g.__user ?? null
}

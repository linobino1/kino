import { env } from './env'

export const getFrontendUrl = (path: string) => {
  return env.FRONTEND_URL + path
}

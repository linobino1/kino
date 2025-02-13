import type { FrontendBrowserEnvironment } from '@app/util/env'
import type { Route } from '../+types/root'

/**
 * get env from the output of remix `useMatches()`
 */
export const getEnvFromMatches = (
  matches: Route.MetaArgs['matches'],
): FrontendBrowserEnvironment | undefined => {
  return (matches.find((match) => match?.id === 'root')?.data as any)
    ?.env as FrontendBrowserEnvironment
}

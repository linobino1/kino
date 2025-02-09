import type { FrontendBrowserEnvironment } from '@app/util/env'

/**
 * get env from the output of remix `useMatches()`
 */
export const getEnvFromMatches = (
  matches: { id: string; data: any }[],
): FrontendBrowserEnvironment | undefined => {
  return (matches.find((match) => match.id === 'root')?.data as any)
    ?.env as FrontendBrowserEnvironment
}

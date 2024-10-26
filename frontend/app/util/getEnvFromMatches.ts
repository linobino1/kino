import { ClientEnvironment } from '~/env.server'

/**
 * get env from the output of remix `useMatches()`
 */
export const getEnvFromMatches = (
  matches: { id: string; data: any }[],
): ClientEnvironment | undefined => {
  return (matches.find((match) => match.id === 'root')?.data as any)?.env as ClientEnvironment
}

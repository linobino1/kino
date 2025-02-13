import { useRouteLoaderData } from 'react-router';
import type { loader } from '~/root'

export const useEnv = () => {
  const data = useRouteLoaderData<typeof loader>('root')
  return data?.env
}

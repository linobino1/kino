import type { loader } from '~/root'
import { useRouteLoaderData } from 'react-router'

export const useRootLoaderData = () => {
  const data = useRouteLoaderData<typeof loader>('root')
  return data
}

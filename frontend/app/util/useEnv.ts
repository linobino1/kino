import { useRouteLoaderData } from '@remix-run/react'
import type { loader } from '~/root'

export const useEnv = () => {
  const data = useRouteLoaderData<typeof loader>('root')
  return data?.env
}

'use server'

import { tmdbAxiosClient } from '@app/themoviedb'
import type { tmdbMovie } from '@app/themoviedb/types'
import { isAuthenticatedRequest } from '@/util/isAuthenticatedRequest'

export const search = async (
  prevState: any,
  formData: FormData,
): Promise<
  | {
      success: true
      data: tmdbMovie[]
    }
  | {
      success: false
      message: string
    }
> => {
  if (!(await isAuthenticatedRequest())) {
    return {
      success: false,
      message: 'Unauthorized',
    }
  }

  const query = formData?.get('query') as string

  const res = await tmdbAxiosClient.get('/search/movie', {
    params: {
      query,
    },
  })
  const data = JSON.parse(res?.data)

  return {
    success: true,
    data: data.results,
  }
}

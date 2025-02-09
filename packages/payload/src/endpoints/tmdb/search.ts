import type { Endpoint } from 'payload'
import { tmdbAxiosClient } from '@app/themoviedb'
import { isAdminOrEditor } from '#payload/access'

export const search: Endpoint = {
  path: `/tmdb-migrate/search/:query`,
  method: 'get',
  handler: async (req) => {
    if (!isAdminOrEditor({ req })) {
      return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    let data: any

    try {
      const res = await tmdbAxiosClient.get('/search/movie', {
        params: {
          query: req?.routeParams?.query,
        },
      })
      data = JSON.parse(res?.data)

      return Response.json({ success: true, data: data.results })
    } catch (error: any) {
      return Response.json({ success: false, message: error.message }, { status: 400 })
    }
  },
}

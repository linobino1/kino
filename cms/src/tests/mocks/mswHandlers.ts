import { HttpResponse, HttpResponseResolver, http } from 'msw'
import { defaultLanguage } from '@/third-party/tmdb'
import { readFileSync } from 'fs'
import path from 'path'

const resolveMovieRequest: HttpResponseResolver = async ({ request, params }) => {
  const { id } = params
  const type = params.type ?? 'movie'
  const url = new URL(request.url)
  const language = url.searchParams.get('language') ?? defaultLanguage

  let data
  try {
    data = await import(`./tmdb-api/movie/${id}/${type}_${language}.json`)
  } catch {
    data = await import(`./tmdb-api/movie/${id}/${type}_${defaultLanguage}.json`)
  }

  return HttpResponse.json(data)
}
export const handlers = [
  http.get('https://api.themoviedb.org/3/movie/:id', resolveMovieRequest),
  http.get('https://api.themoviedb.org/3/movie/:id/:type', resolveMovieRequest),
  http.get('https://image.tmdb.org/*', async () => {
    const file = readFileSync(path.resolve(import.meta.dirname, './poster.avif'))

    return HttpResponse.arrayBuffer(file.buffer, {
      headers: {
        'Content-Type': 'image/avif',
      },
    })
  }),
]

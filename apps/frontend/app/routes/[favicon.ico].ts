import type { Media } from '@app/types/payload'
import type { LoaderFunction} from '@remix-run/node';
import { redirect } from '@remix-run/node'
import { getPayload } from '~/util/getPayload.server'

export const loader: LoaderFunction = async () => {
  const payload = await getPayload()
  const site = await payload.findGlobal({
    slug: 'site',
    depth: 1,
  })
  const url = (site.favicon as Media).url

  if (!url) {
    throw new Response('Not found', { status: 404 })
  }

  return redirect(url)
}

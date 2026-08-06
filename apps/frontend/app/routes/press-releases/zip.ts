import type { Route } from './+types/zip'
import { formatDate } from '@app/util/formatDate'
import { getPayload } from '~/util/getPayload.server'
import { renderPressStillsZip } from './zip.server'

export const loader = async ({ params: { id } }: Route.LoaderArgs) => {
  const payload = await getPayload()
  const pressRelease = await payload.findByID({
    collection: 'pressReleases',
    id,
  })

  if (!pressRelease) {
    throw new Response('Not Found', { status: 404 })
  }

  const filename = `Pressemitteilung-${formatDate(pressRelease.date, 'dd_MM_yyyy')}-Abbildungen.zip`

  let buffer
  try {
    buffer = await renderPressStillsZip({ pressRelease })
  } catch (error) {
    payload.logger.error('Failed to generate press still ZIP:')
    payload.logger.error(error)
    return new Response(`${error}`, { status: 500 })
  }

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${encodeURI(filename)}"`,
      'Content-Length': `${buffer.length}`,
      'Cache-Control': 'max-age=0, must-revalidate',
    },
  })
}

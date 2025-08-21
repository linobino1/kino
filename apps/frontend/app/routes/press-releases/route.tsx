import { getPayload } from '~/util/getPayload.server'
import type { Route } from './+types/route'
import { renderPressPDF } from './pdf/render'
import { getFixedT } from '@app/i18n/getFixedT'
import { formatDate } from '@app/util/formatDate'

export const loader = async ({ params: { id }, request: { url } }: Route.LoaderArgs) => {
  const preview = !!new URL(url).searchParams.get('preview')

  const payload = await getPayload()
  const pressRelease = await payload.findByID({
    collection: 'pressReleases',
    id,
    draft: preview,
  })

  if (!pressRelease) {
    throw new Response('Not Found', { status: 404 })
  }

  const t = await getFixedT(pressRelease.locale)
  const filename = t('pdf.filename', { date: formatDate(pressRelease.date, 'dd_MM_yyyy') })

  let buffer
  try {
    buffer = await renderPressPDF({ pressRelease })
  } catch (error) {
    payload.logger.error('Failed to generate PDF:')
    payload.logger.error(error)
    return new Response(`${error}`, { status: 500 })
  }

  // @ts-expect-error can pass buffer to response
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': preview ? 'inline' : `attachment; filename="${encodeURI(filename)}"`,
      'Content-Length': `${buffer.length}`,
      'Cache-Control': 'max-age=0, must-revalidate',
    },
  })
}

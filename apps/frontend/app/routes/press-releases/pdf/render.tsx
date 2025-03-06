import type { PressRelease } from '@app/types/payload'
import { getPayloadClient } from '#payload/util/getPayloadClient'
import { getDocId } from '@app/util/payload/getDocId'
import { renderToBuffer } from '@react-pdf/renderer'
import { PressPDF } from './template'
import { getFixedT } from '@app/i18n/getFixedT'

type Props = {
  pressRelease: PressRelease
}

export const renderPressPDF = async ({ pressRelease }: Props) => {
  const payload = await getPayloadClient()

  // fetch the events
  const events = (
    await payload.find({
      collection: 'events',
      where: {
        season: {
          equals: getDocId(pressRelease.season),
        },
      },
      depth: 5,
      locale: pressRelease.locale,
      draft: false,
      limit: 100,
      sort: 'date',
    })
  ).docs

  // fetch the global press releases config
  const pressReleasesConfig = await payload.findGlobal({
    slug: 'pressReleasesConfig',
    locale: pressRelease.locale,
  })

  const t = await getFixedT('de')

  return await renderToBuffer(
    <PressPDF
      pressReleasesConfig={pressReleasesConfig}
      pressRelease={pressRelease}
      events={events}
      t={t}
    />,
  )
}

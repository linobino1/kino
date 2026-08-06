import type { PressRelease } from '@app/types/payload'
import { getPayloadClient } from '#payload/util/getPayloadClient'
import { renderToBuffer } from '@react-pdf/renderer'
import { PressPDF } from './template'
import { getTFunction } from '~/util/i18n/getTFunction.server'
import { getPressReleaseEvents } from '../data.server'

type Props = {
  pressRelease: PressRelease
}

export const renderPressPDF = async ({ pressRelease }: Props) => {
  const payload = await getPayloadClient()

  const events = await getPressReleaseEvents({ pressRelease })

  // fetch the global press releases config
  const pressReleasesConfig = await payload.findGlobal({
    slug: 'pressReleasesConfig',
    locale: pressRelease.locale,
  })

  const t = await getTFunction(pressRelease.locale, 'common')

  return await renderToBuffer(
    <PressPDF
      pressReleasesConfig={pressReleasesConfig}
      pressRelease={pressRelease}
      events={events}
      t={t}
    />,
  )
}

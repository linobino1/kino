import { getPayloadClient } from '#payload/util/getPayloadClient'
import Newsletter from './templates/Newsletter'
import { render } from '@react-email/components'
import { getFixedT } from '@app/i18n/getFixedT'

export const renderMailing = async (mailingId: string, draft: boolean = false): Promise<string> => {
  const payload = await getPayloadClient()
  const mailing = await payload.findByID({
    collection: 'mailings',
    id: mailingId,
    draft,
    depth: 4,
  })

  const locale = mailing.language || 'de'
  const t = await getFixedT(locale)

  return await render(<Newsletter mailing={mailing} t={t} locale={locale} />)
}

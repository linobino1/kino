import { expect, test } from 'vitest'
import { getPayloadTestClient } from './getPayloadTestClient'
import { createScreeningEvent } from './createDoc/screeningEvent'
import { locales } from '@app/i18n'
import { lexicalContent } from './util/lexicalContent'
import { lexicalToPlainText } from '@app/util/lexical/lexicalToPlainText'

test('test events.programItems.info localization', async () => {
  const payload = await getPayloadTestClient()

  await payload.delete({ collection: 'events', where: { id: { exists: true } } })

  // create a casablanca screening
  const doc = await createScreeningEvent({ payload })
  const media = (
    await payload.find({
      collection: 'media',
      limit: 1,
    })
  ).docs[0]

  // update the mainProgramItem's additional info
  for await (const locale of locales) {
    const programItemID = doc.programItems?.[0].id
    await payload.update({
      collection: 'events',
      id: doc.id,
      data: {
        programItems: [
          {
            type: 'other',
            isMainProgram: true,
            poster: media.id,
            info: lexicalContent(`info in ${locale}`),
            id: programItemID,
          },
        ],
      },
      locale,
    })
  }

  for await (const locale of locales) {
    const localizedDoc = await payload.findByID({
      collection: 'events',
      id: doc.id,
      locale,
    })

    for (const programItem of localizedDoc.programItems ?? []) {
      expect(lexicalToPlainText(programItem.info)).toBe(`info in ${locale}`)
    }
  }
})

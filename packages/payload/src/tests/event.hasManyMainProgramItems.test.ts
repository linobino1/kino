import { expect, test } from 'vitest'
import { getPayloadTestClient } from './getPayloadTestClient'
import { createScreeningEvent } from './createDoc/screeningEvent'
import { locales } from '@app/i18n'
import { lexicalContent } from './util/lexicalContent'
import { lexicalToPlainText } from '@app/util/lexical/lexicalToPlainText'
import { getDocId } from '@app/util/payload/getDocId'
import { getEventSubtitle } from '@app/util/data/getEventSubtitle'
import type { FilmPrint } from '@app/types/payload'
import { getFixedT } from '@app/i18n/getFixedT'

test('test implicit data of an event with many main program items', async () => {
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
  const movie = await payload.findByID({
    collection: 'movies',
    id: getDocId((doc.mainProgramFilmPrint as FilmPrint).movie),
  })

  expect(doc.shortDescription).toBe(movie.synopsis)

  // create another main program item
  await payload.update({
    collection: 'events',
    id: doc.id,
    data: {
      programItems: [
        ...(doc.programItems ?? []),
        {
          type: 'screening',
          isMainProgram: true,
          poster: media.id,
          filmPrint: getDocId(doc.mainProgramFilmPrint),
        },
      ],
      header: media.id, // is required to create the event's season
    },
  })

  // add localized intro & subtitle
  for await (const locale of locales) {
    await payload.update({
      collection: 'events',
      id: doc.id,
      data: {
        intro: lexicalContent(`intro in ${locale}`),
        subtitle: `subtitle in ${locale}`,
      },
      locale,
    })
  }

  // check event.shortDescription
  for await (const locale of locales) {
    const t = await getFixedT(locale)

    const localizedDoc = await payload.findByID({
      collection: 'events',
      id: doc.id,
      locale,
    })

    expect(lexicalToPlainText(localizedDoc.intro)).toBe(`intro in ${locale}`)
    expect(localizedDoc.shortDescription).toBe(`intro in ${locale}`)
    expect(localizedDoc.subtitle).toBe(`subtitle in ${locale}`)
    expect(getEventSubtitle({ event: localizedDoc, t })).toBe(`subtitle in ${locale}`)
  }
})

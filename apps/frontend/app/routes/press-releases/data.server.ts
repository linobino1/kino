import type { Event, PressRelease } from '@app/types/payload'
import { getPayloadClient } from '@app/payload/util/getPayloadClient'
import { getDocId } from '@app/util/payload/getDocId'

type Props = {
  pressRelease: PressRelease
}

export const getPressReleaseEvents = async ({ pressRelease }: Props): Promise<Event[]> => {
  const payload = await getPayloadClient()

  return (
    await payload.find({
      collection: 'events',
      where: {
        and: [
          { _status: { equals: 'published' } },
          {
            season: {
              equals: getDocId(pressRelease.season),
            },
          },
        ],
      },
      depth: 5,
      locale: pressRelease.locale,
      draft: false,
      limit: 100,
      sort: 'date',
    })
  ).docs
}

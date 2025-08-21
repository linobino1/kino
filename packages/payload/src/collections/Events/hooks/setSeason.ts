import type { CollectionBeforeValidateHook } from 'payload'
import type { Event } from '@app/types/payload'
import { createSeason } from '#payload/util/createSeason'
import { CustomAPIError } from '#payload/util/CustomAPIError'
import { getDocId } from '@app/util/payload/getDocId'

export const setSeason: CollectionBeforeValidateHook<Event> = async ({
  data,
  req,
  originalDoc,
}) => {
  if (req.context.triggerHooks === false) return data

  const dateString = data?.date ?? originalDoc?.date
  if (!dateString) return data

  const date = new Date(dateString)
  let season = (
    await req.payload.find({
      collection: 'seasons',
      depth: 0,
      where: {
        and: [
          {
            from: {
              less_than_equal: date,
            },
          },
          {
            until: {
              greater_than_equal: date,
            },
          },
        ],
      },
      req,
    })
  ).docs[0]

  // if no season is found, create one for the event's date
  if (!season) {
    if (!data?.header) {
      throw new CustomAPIError(
        `Bitte setze ein Header-Bild, mit dem die Spielzeit erstellt werden kann.`,
      )
    }
    season = await createSeason({ date, header: getDocId(data.header) })
  }

  return {
    ...data,
    season: season.id,
  }
}

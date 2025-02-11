import type { Payload } from 'payload'
import { createMedia } from './media'

export const createSeason = async ({ payload }: { payload: Payload }) => {
  const media = await createMedia({ payload })

  return await payload.create({
    collection: 'seasons',
    data: {
      name: 'Wintersemester 2025',
      header: media.id,
    },
  })
}

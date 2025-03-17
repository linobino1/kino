import type { Payload } from 'payload'
import { createMedia } from './media'

export const createSeason = async ({ payload }: { payload: Payload }) => {
  const media = await createMedia({ payload })

  return await payload.create({
    collection: 'seasons',
    data: {
      name: 'Wintersemester 2025',
      header: media.id,
      from: '2025-10-01T00:00:00.000Z',
      until: '2026-03-31T23:59:59.999Z',
    },
  })
}

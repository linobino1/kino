import type { Payload } from 'payload'

export const createFormat = async ({ payload }: { payload: Payload }) =>
  await payload.create({
    collection: 'formats',
    data: {
      name: '35mm',
    },
  })

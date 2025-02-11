import type { Payload } from 'payload'
import { projectRoot } from '@app/util/projectRoot'
import path from 'path'

export const createMedia = async ({ payload }: { payload: Payload }) => {
  return await payload.create({
    collection: 'media',
    data: {},
    filePath: path.resolve(projectRoot, 'packages/seed/src/media/favicon.webp'),
  })
}

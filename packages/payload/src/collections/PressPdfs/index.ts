import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '#payload/access/index'
import { projectRoot } from '@app/util/projectRoot'
import path from 'path'
import { generatePDF } from './hooks/generatePDF'

export const staticDir = path.resolve(projectRoot, 'pressPdfs')

export const PressPdfs: CollectionConfig<'pressPdfs'> = {
  slug: 'pressPdfs',
  labels: {
    singular: 'Presse PDF',
    plural: 'Presse PDFs',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Medien',
  },
  access: {
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  upload: {
    staticDir,
    mimeTypes: ['application/pdf'],
    filesRequiredOnCreate: false,
  },
  hooks: {
    beforeChange: [generatePDF],
  },
  fields: [
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      required: true,
    },
    {
      name: 'season',
      label: 'Spielzeit',
      type: 'relationship',
      relationTo: 'seasons',
      required: true,
    },
  ],
}

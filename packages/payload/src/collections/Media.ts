import type { CollectionConfig } from 'payload'
import path from 'path'
import { projectRoot } from '@app/util/projectRoot'

export const staticDir = path.resolve(projectRoot, 'media')

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Mediendatei',
    plural: 'Medien',
  },
  admin: {
    group: 'Medien',
    pagination: {
      defaultLimit: 100,
      limits: [50, 100, 250, 500],
    },
    enableRichTextLink: true,
    enableRichTextRelationship: true,
  },
  access: {
    read: (): boolean => true, // Everyone can read Media
  },
  upload: {
    staticDir,
    mimeTypes: ['image/*', 'application/pdf'],
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      admin: {
        description: 'Leer lassen, um den Dateinamen als Alt-Text zu verwenden',
      },
      localized: true,
    },
    {
      name: 'tmdbFilepath',
      type: 'text',
      label: 'TMDB Dateipfad',
      required: false,
      unique: false,
      admin: {
        readOnly: true,
      },
    },
  ],
}

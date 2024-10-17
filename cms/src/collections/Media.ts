import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      admin: {
        description: 'Leer lassen, um den Dateinamen als Alt-Text zu verwenden',
      },
      hooks: {
        beforeValidate: [
          // use filename as alt text if alt text is empty
          ({ value, data }) => {
            if (typeof value === 'string' && value.length > 0) {
              return value
            }
            if (typeof data?.filename === 'string') {
              return data.filename.split('.')[0]
            }
            return value
          },
        ],
      },
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

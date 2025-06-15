import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'imageBlock',
  labels: {
    singular: 'Bild',
    plural: 'Bilder',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      filterOptions() {
        return {
          mimeType: {
            contains: 'image/',
          },
        }
      },
      required: true,
    },
    {
      name: 'caption',
      label: 'Bildunterschrift',
      type: 'text',
    },
  ],
}

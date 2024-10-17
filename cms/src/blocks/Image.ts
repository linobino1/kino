import type { Block } from 'payload'

export const Image: Block = {
  slug: 'image',
  labels: {
    singular: 'Bild',
    plural: 'Bilder',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}

export default Image

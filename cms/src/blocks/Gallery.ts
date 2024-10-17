import type { Block } from 'payload'

export const Gallery: Block = {
  slug: 'gallery',
  labels: {
    singular: 'Galerie',
    plural: 'Galerien',
  },
  fields: [
    {
      name: 'images',
      type: 'array',
      minRows: 2,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}

export default Gallery

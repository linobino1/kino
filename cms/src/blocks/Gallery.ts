import type { Block } from 'payload'

export const Gallery: Block = {
  slug: 'gallery',
  labels: {
    singular: 'Galerie',
    plural: 'Galerien',
  },
  interfaceName: 'GalleryBlockType',
  fields: [
    {
      name: 'images',
      label: false,
      type: 'array',
      minRows: 2,
      labels: {
        singular: 'Bild',
        plural: 'Bilder',
      },
      fields: [
        {
          name: 'image',
          label: false,
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}

export default Gallery

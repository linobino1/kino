import type { Block } from 'payload'

export const Video: Block = {
  slug: 'video',
  labels: {
    singular: 'Video',
    plural: 'Videos',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
    },
  ],
}

export default Video

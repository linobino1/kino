import type { Block } from 'payload'

export const Content: Block = {
  slug: 'content',
  labels: {
    singular: 'Inhalt',
    plural: 'Inhalt',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
  ],
}

export default Content

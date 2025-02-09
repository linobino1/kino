import type { Block } from 'payload'

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlockType',
  labels: {
    singular: 'Freitext',
    plural: 'Freitext',
  },
  fields: [
    {
      name: 'content',
      label: false,
      type: 'richText',
      localized: true,
    },
  ],
}

export default Content

import type { Block } from 'payload'

export const Heading: Block = {
  slug: 'heading',
  labels: {
    singular: 'Überschrift',
    plural: 'Überschriften',
  },
  fields: [
    {
      name: 'text',
      label: 'Text',
      type: 'text',
      localized: true,
    },
  ],
}

export default Heading

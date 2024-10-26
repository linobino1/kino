import type { Block } from 'payload'

export const RawHTML: Block = {
  slug: 'rawHTML',
  labels: {
    singular: 'HTML',
    plural: 'HTML',
  },
  interfaceName: 'RawHTMLBlockType',
  fields: [
    {
      name: 'html',
      label: 'Inhalt',
      type: 'code',
      required: true,
    },
  ],
}

export default RawHTML

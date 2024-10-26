import type { Block } from 'payload'

export const Events: Block = {
  slug: 'events',
  labels: {
    singular: 'Events',
    plural: 'Events',
  },
  interfaceName: 'EventsBlockType',
  fields: [
    {
      name: 'type',
      type: 'radio',
      required: true,
      options: [
        {
          label: 'Manuell befüllen',
          value: 'manual',
        },
        {
          label: 'nach Vorstellungsreihe',
          value: 'screeningSeries',
        },
      ],
    },
    {
      name: 'events',
      type: 'array',
      labels: {
        singular: 'Events',
        plural: 'Events',
      },
      minRows: 1,
      fields: [
        {
          name: 'doc',
          label: 'Event',
          type: 'relationship',
          relationTo: 'events',
          required: true,
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData.type === 'manual',
      },
    },
    {
      name: 'screeningSeries',
      label: 'Vorstellungsreihe',
      type: 'relationship',
      relationTo: 'screeningSeries',
      hasMany: false,
      admin: {
        condition: (_, siblingData) => siblingData.type === 'screeningSeries',
      },
    },
  ],
}

export default Events

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
          label: 'nach Veranstaltungsreihe',
          value: 'eventSeries',
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
      name: 'eventSeries',
      label: 'Veranstaltungsreihe',
      type: 'relationship',
      relationTo: 'eventSeries',
      hasMany: false,
      admin: {
        condition: (_, siblingData) => siblingData.type === 'eventSeries',
      },
    },
  ],
}

export default Events

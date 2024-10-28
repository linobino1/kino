import type { Block } from 'payload'

export const KronolithCalendarEmbed: Block = {
  slug: 'kronolithCalendarEmbed',
  labels: {
    singular: 'Kronolith Kalender',
    plural: 'Kronolith Kalender',
  },
  interfaceName: 'KronolithCalendarEmbedBlockType',
  fields: [
    {
      name: 'url',
      label: 'URL',
      type: 'text',
      required: true,
      admin: {
        description:
          'z.B. https://webmail.hfg-karlsruhe.de/services/ajax.php/kronolith/embed?token=bGumTYVcPSXJCOnQq5ddVk1&calendar=internal_hwwfPnACHMVRk4ZwVVQ4V--&container=kronolithCal&view=Monthlist',
      },
    },
  ],
}

export default KronolithCalendarEmbed

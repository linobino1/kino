import type { Field } from 'payload'

type Options = {
  excludeEvent?: boolean
}

export const attachedLinksField = ({ excludeEvent = false }: Options = {}): Field => ({
  name: 'links',
  label: 'Links',
  type: 'array',
  fields: [
    {
      name: 'type',
      label: 'Typ',
      type: 'select',
      required: true,
      defaultValue: 'custom',
      options: [
        { label: 'Programm', value: 'programme' },
        { label: 'Download', value: 'download' },
        { label: 'Trailer/Videolink', value: 'trailer' },
        ...(!excludeEvent ? [{ label: 'Veranstaltung', value: 'event' }] : []),
        { label: 'Benutzerdefiniert', value: 'custom' },
      ],
    },
    {
      name: 'url',
      label: 'URL',
      type: 'text',
      required: false,
      admin: {
        condition: (_, siblingData) => ['custom', 'trailer'].includes(siblingData?.type),
      },
    },
    {
      name: 'event',
      label: 'Veranstaltung',
      type: 'relationship',
      relationTo: 'events',
      required: false,
      admin: {
        condition: (_, siblingData) => !excludeEvent && siblingData?.type === 'event',
      },
    },
    {
      name: 'programme',
      label: 'Programmdatei',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'programme',
      },
    },
    {
      name: 'download',
      label: 'Download-Datei',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'download',
      },
    },
    {
      name: 'label',
      label: 'Beschriftung',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
        description: 'Optional. Wenn leer, wird die URL ohne http:// oder https:// angezeigt.',
      },
    },
  ],
})

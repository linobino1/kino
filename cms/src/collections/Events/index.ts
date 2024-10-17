import type { CollectionConfig, Validate } from 'payload'
import type { Movie } from '@/payload-types'
import { getDefaultDocId } from '@/fields/default'
// import { MigrateMovieButton } from '@/MigrateMovie/admin/Button'
import { isAdminOrEditor } from '@/access'
import { slugGenerator } from './util/slugGenerator'
import { updateImages } from './hooks/updateImages'

const requiredForNonScreeningEvents: Validate = (value: string, { data }) => {
  if (data?.type !== 'screening' && !value) return 'Feld ist für nicht-Vorstellungen erforderlich'
  return true
}

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
  admin: {
    group: 'Kalender',
    defaultColumns: ['date', 'title', '_status'],
    useAsTitle: 'title',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: (args) => {
      if (isAdminOrEditor(args)) return true
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },
  custom: {
    addUrlField: {
      hook: (slug?: string) => `/events/${slug || ''}`,
    },
    addSlugField: {
      generator: slugGenerator,
    },
  },
  hooks: {
    beforeChange: [updateImages],
  },
  fields: [
    {
      name: 'type',
      label: 'Art',
      type: 'select',
      options: [
        { label: 'Vorstellung', value: 'screening' },
        { label: 'Event', value: 'event' },
      ],
      defaultValue: 'screening',
    },
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      localized: true,
      admin: {
        description:
          'Leer lassen, um den Titel des ersten Spielfilms zu verwenden, falls es sich um eine Vorstellung handelt',
      },
      validate: requiredForNonScreeningEvents,
      hooks: {
        beforeChange: [
          // if the field is empty, we will fill it with the title of the first film
          async ({ data, value, req }) => {
            if (value) return value
            if (!data?.films?.length) return undefined
            const filmPrint = await req.payload.findByID({
              collection: 'filmPrints',
              id: data.films[0].filmprint,
              locale: req.locale,
              depth: 4,
            })
            return (filmPrint?.movie as Movie)?.title
          },
        ],
      },
    },
    {
      name: 'subtitle',
      label: 'Untertitel',
      type: 'text',
      localized: true,
      admin: {
        condition: (data) => data?.type !== 'screening',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          label: 'Datum & Uhrzeit',
          type: 'date',
          required: true,
          defaultValue: () => {
            const res = new Date()
            res.setHours(19, 0, 0, 0)
            return res.toISOString()
          },
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            description:
              'Achtung: wenn du dich in einer anderen Zeitzone als das Kino befindest, musst du den Unterschied ausgleichen.',
            width: '50%',
          },
        },
        {
          name: 'location',
          label: 'Spielstätte',
          type: 'relationship',
          relationTo: 'locations',
          defaultValue: () => getDefaultDocId('locations'),
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'season',
          label: 'Spielzeit',
          type: 'relationship',
          relationTo: 'seasons',
          hasMany: false,
          required: true,
          defaultValue: () =>
            fetch(`/api/seasons/`)
              .then((res) => res.json())
              .then((res) => res.docs[0].id)
              .catch(() => null),
          admin: {
            width: '50%',
          },
        },
        {
          name: 'series',
          label: 'Vorstellungsreihe',
          type: 'relationship',
          relationTo: 'screeningSeries',
          hasMany: false,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'header',
      label: 'Titelbild',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data?.type !== 'screening',
      },
      validate: requiredForNonScreeningEvents,
    },
    {
      name: 'poster',
      label: 'Filmposter',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data?.type !== 'screening',
      },
      validate: requiredForNonScreeningEvents,
    },
    {
      name: 'info',
      label: 'Info',
      type: 'richText',
      admin: {
        description:
          'Infos zur Veranstaltung. Bei Veranstaltungen ohne Filme bildet das den Hauptinhalt.',
      },
      localized: true,
      required: false,
      validate: requiredForNonScreeningEvents,
    },
    {
      name: 'films',
      label: 'Filme',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        // TODO
        // {
        //   name: 'migrateMovie',
        //   type: 'ui',
        //   admin: {
        //     components: {
        //       Field: () => MigrateMovieButton({ newTab: true }),
        //     },
        //   },
        // },
        {
          name: 'filmprint',
          label: 'Filmkopie',
          type: 'relationship',
          relationTo: 'filmPrints',
          required: true,
          filterOptions: {
            _status: {
              equals: 'published',
            },
          },
        },
        {
          name: 'isSupportingFilm',
          label: 'Ist Vorfilm',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'info',
          label: 'Info',
          type: 'richText',
          localized: true,
          required: false,
          admin: {
            description: 'Infos zum Film / der Kopie.',
          },
        },
      ],
      admin: {
        condition: (data) => data?.type === 'screening',
      },
    },
    {
      name: 'moderator',
      label: 'Moderation',
      type: 'text',
      required: false,
    },
    {
      name: 'guest',
      label: 'Gast',
      type: 'text',
      required: false,
    },
    {
      name: 'excludeFromUpcoming',
      label: 'Nicht im Programm anzeigen',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Wenn der Haken gesetzt ist, wird die Vorstellung nicht auf der Startseite und in der Liste der kommenden Vorstellungen angezeigt.',
      },
    },
  ],
}

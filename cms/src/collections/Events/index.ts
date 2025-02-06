import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access'
import { slugGenerator } from './util/slugGenerator'
import { generateImplicitData } from './hooks/generateImplicitData'

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  labels: {
    singular: 'Veranstaltung',
    plural: 'Veranstaltungen',
  },
  admin: {
    group: 'Kalender',
    defaultColumns: ['date', 'title', '_status'],
    useAsTitle: 'title',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 500,
      },
    },
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
    beforeValidate: [generateImplicitData],
  },
  fields: [
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      localized: true,
      // required: true,
      admin: {
        description:
          'Leer lassen, um den Titel des letzten Hauptfilms zu verwenden, falls es sich um eine Vorstellung handelt',
      },
    },
    {
      name: 'subtitle',
      label: 'Untertitel',
      type: 'text',
      localized: true,
      admin: {
        description:
          'Leer lassen, um die faktischen Infos des letzten Hauptfilms zu verwenden (Regie, Jahr, etc.)',
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
          defaultValue: async ({ req: { payload } }) =>
            (
              await payload.find({
                collection: 'locations',
                limit: 1,
                where: { default: { equals: true } },
              })
            ).docs[0].id,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'season',
      label: 'Spielzeit',
      type: 'relationship',
      relationTo: 'seasons',
      hasMany: false,
      required: true,
      defaultValue: async ({ req: { payload } }) =>
        (
          await payload.find({
            collection: 'seasons',
            limit: 1,
          })
        ).docs[0].id,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'series',
      label: 'Veranstaltungsreihe',
      type: 'relationship',
      relationTo: 'screeningSeries',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
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
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Überblick',
          fields: [
            {
              name: 'header',
              label: 'Titelbild',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data) => data?.type !== 'screening',
              },
              required: true,
            },
            {
              name: 'intro',
              label: 'Einleitung',
              type: 'richText',
              admin: {
                description:
                  'Infos zur Veranstaltung. Bei Veranstaltungen ohne Programmpunkte bildet das den Hauptinhalt.',
              },
              localized: true,
            },
            {
              name: 'comment',
              label: 'Kommentar',
              type: 'textarea',
              required: false,
              localized: true,
            },
          ],
        },
        {
          label: 'Programmpunkte',
          fields: [
            {
              name: 'programItems',
              label: false,
              labels: {
                singular: 'Programmpunkt',
                plural: 'Programmpunkte',
              },
              type: 'array',
              fields: [
                {
                  name: 'type',
                  label: 'Art',
                  type: 'radio',
                  options: [
                    { label: 'Screening', value: 'screening' },
                    { label: 'Andere', value: 'other' },
                  ],
                  defaultValue: 'screening',
                },
                {
                  name: 'isMainProgram',
                  label: 'Ist Hauptprogramm',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'poster',
                  label: 'Poster',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'filmPrint',
                  label: 'Filmkopie',
                  type: 'relationship',
                  relationTo: 'filmPrints',
                  required: true,
                  filterOptions: {
                    _status: {
                      equals: 'published',
                    },
                  },
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'screening',
                  },
                },
                {
                  name: 'info',
                  label: 'Zusatzinfo',
                  type: 'richText',
                  localized: true,
                  required: false,
                  admin: {
                    description: 'Infos zu diesem Programmpunkt im Rahmen dieser Veranstaltung.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'isScreeningEvent',
      type: 'checkbox',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'mainProgramFilmPrint',
      type: 'relationship',
      relationTo: 'filmPrints',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      admin: {
        hidden: true,
      },
    },
  ],
}

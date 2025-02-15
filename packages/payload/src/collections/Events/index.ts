import type { CollectionConfig } from 'payload'
import type { Event } from '@app/types/payload'
import { isAdminOrEditor } from '#payload/access'
import { generateImplicitData } from './hooks/generateImplicitData'
import { translateImplicitData } from './hooks/translateImplicitData'
import { slugField } from '#payload/fields/slug'

const isScreening = (data: any) =>
  data?.programItems?.some((item: any) => item?.type === 'screening' && item?.isMainProgram)

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
  },
  hooks: {
    beforeValidate: [generateImplicitData],
    afterChange: [translateImplicitData],
  },
  fields: [
    ...slugField(undefined, {
      generator: () => {}, // we'll handle this in the collection hook
    }),
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      localized: true,
      required: true,
      validate: (value: any, { data }: { data: Partial<Event> }) => {
        if (!isScreening(data) && !value) {
          return 'Der Titel darf nicht leer sein.'
        }
        return true
      },
      admin: {
        description:
          'Bei Filmvorstellungen wird der Titel des letzten Films im Hauptprogramm verwendet, wenn dieses Feld leer bleibt. Refresh benötigt.',
      },
    },
    {
      name: 'subtitle',
      label: 'Untertitel',
      type: 'text',
      localized: true,
      admin: {
        description:
          'Dieses Feld bei einer Filmvorstellung leer lassen, um die Credits des Hauptfilms zu verwenden. Für sonstige Veranstaltungen kann hier ein Untertitel eingetragen werden. Wird auf der Veranstaltungsseite und in den Veranstaltungs-"Tickets" angezeigt.',
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
          timezone: true,
          defaultValue: () => {
            const res = new Date()
            res.setHours(19, 0, 0, 0)
            return res.toISOString()
          },
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'PP HH:mm',
              timeFormat: 'HH:mm',
            },
            width: '50%',
            components: {
              Cell: {
                path: '/components/date/Cell.tsx#Cell',
              },
            },
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
            ).docs[0]?.id,
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
      label: 'Veranstaltungsreihe(n)',
      type: 'relationship',
      relationTo: 'eventSeries',
      hasMany: true,
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
          label: 'Programmpunkte',
          admin: {
            description:
              'Wird ein Programmpunkt als Typ "Filmvorstellung" im "Hauptprogramm" hinzugefügt, zählt die Veranstaltung als Filmvorstellung.',
          },
          fields: [
            {
              name: 'programItems',
              label: false,
              labels: {
                singular: 'Programmpunkt',
                plural: 'Programmpunkte',
              },
              type: 'array',
              minRows: 1,
              validate: (data) => {
                if (!data?.length) {
                  return 'Es muss mindestens ein Programmpunkt angelegt werden.'
                }
                if (!data?.some((item: any) => item?.isMainProgram)) {
                  return "Mindestens ein Programmpunkt muss als 'Hauptprogramm' markiert sein."
                }
                return true
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'type',
                      label: false,
                      type: 'radio',
                      options: [
                        { label: 'Filmvorstellung', value: 'screening' },
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
                  ],
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
                  name: 'poster',
                  label: 'Poster',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'other',
                    description:
                      "Hier muss für 'Andere' Programmpunkte ein Bild ausgewählt werden. Wird auf der Veranstaltungsseite angezeigt, wo bei bei Vorstellungen das Filmposter erscheint. Hochkant empfohlen.",
                  },
                },
                {
                  name: 'info',
                  label: 'Info',
                  type: 'richText',
                  localized: true,
                  required: false,
                  admin: {
                    description:
                      "Bei Vorstellungen sind hier zusätzliche Informationen zur Filmkopie einzutragen, bei 'Anderen' Programmpunkten die vollständige Beschreibung.",
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Weitere Infos',
          fields: [
            {
              name: 'header',
              label: 'Titelbild',
              type: 'upload',
              relationTo: 'media',
              required: true,
              validate: (value: any, { data }: { data: Partial<Event> }) => {
                if (isScreening(data)) return true
                return value ? true : 'Es muss ein Titelbild ausgewählt werden.'
              },
              admin: {
                description:
                  'Muss nur für Veranstaltungen ohne Filme gesetzt werden, ansonsten wird das Filmstill verwendet. Refresh benötigt.',
              },
            },
            {
              name: 'intro',
              label: 'Einleitung',
              type: 'richText',
              admin: {
                description:
                  'Optional. Wird vor den Programmpunkten auf der Veranstaltungsseite angezeigt.',
              },
              localized: true,
            },
            {
              name: 'comment',
              label: 'Kommentar',
              type: 'textarea',
              localized: true,
              admin: {
                description: 'Optional. Wird auf den "Tickets" in Veranstaltungslisten angezeigt.',
              },
            },
            {
              name: 'partnerLogos',
              label: 'Partner-Logos',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: {
                description:
                  'Optional. Werden auf der Veranstaltungsseite ganz unten angezeigt als Kooperationspartner.',
              },
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

import type { GlobalConfig } from 'payload'
import { metaField } from '@/fields/meta'
import pageLayout from '@/fields/pageLayout'

export const EventsPage: GlobalConfig = {
  slug: 'eventsPage',
  admin: {
    group: 'Seiten',
    description: 'Die Seite "Vorstellungen" listet alle Vorstellungen ab dem heutigen Tage.',
  },
  label: 'Vorstellungen',
  fields: [pageLayout(), metaField('Meta')],
}

import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'
import { formatDate } from '@app/util/formatDate'

const getAdminTitle = (title: Record<string, unknown> | undefined, date: string | Date) =>
  Object.fromEntries(
    Object.entries(title || {}).flatMap(([locale, value]) =>
      typeof value === 'string' ? [[locale, `${value} - ${formatDate(date, 'dd.MM.yyyy')}`]] : [],
    ),
  )

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const events = payload.db.connection
    .collection('events')
    .find({ title: { $exists: true }, date: { $exists: true } })

  for await (const event of events) {
    await payload.db.connection
      .collection('events')
      .updateOne(
        { _id: event._id },
        { $set: { _adminTitle: getAdminTitle(event.title, event.date) } },
      )
  }

  const versions = payload.db.connection
    .collection('_events_versions')
    .find({ 'version.title': { $exists: true }, 'version.date': { $exists: true } })

  for await (const version of versions) {
    await payload.db.connection.collection('_events_versions').updateOne(
      { _id: version._id },
      {
        $set: {
          'version._adminTitle': getAdminTitle(version.version.title, version.version.date),
        },
      },
    )
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.connection.collection('events').updateMany({}, { $unset: { _adminTitle: '' } })
  await payload.db.connection
    .collection('_events_versions')
    .updateMany({}, { $unset: { 'version._adminTitle': '' } })
}

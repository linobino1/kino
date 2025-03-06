import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  return
  // await payload.db.connection.collection('screeningSeries').rename('eventSeries')
  await payload.db.connection.db?.renameCollection('screeningseries', 'eventseries', {
    dropTarget: true,
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  return
  // Migration code
  await payload.db.connection.db?.renameCollection('eventseries', 'screeningseries')
}

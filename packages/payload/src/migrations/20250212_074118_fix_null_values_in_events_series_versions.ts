import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  return
  await payload.db.connection.collection('_events_versions').updateMany(
    {
      $or: [{ 'version.series': [null] }, { 'version.series': [] }, { 'version.series': null }],
    },
    [
      {
        $unset: 'version.series',
      },
    ],
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Migration code
}

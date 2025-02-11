import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  // make an array from the events.series field
  await payload.db.connection.collection('events').updateMany(
    {
      series: { $exists: true },
    },
    [
      {
        $set: {
          series: ['$series'],
        },
      },
    ],
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Migration code
}

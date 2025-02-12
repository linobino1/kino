import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  await payload.db.connection.collection('events').updateMany(
    {
      $or: [{ series: [null] }, { series: [] }, { series: null }],
    },
    [
      {
        $unset: 'series',
      },
    ],
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Migration code
}

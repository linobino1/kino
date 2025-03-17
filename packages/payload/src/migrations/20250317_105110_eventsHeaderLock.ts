import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  // set events.headerLock to true, so far we didn't have the possibility to use a header different from the movie still
  await payload.db.connection.collection('events').updateMany(
    {
      headerLock: { $exists: false },
    },
    [{ $set: { headerLock: true } }],
  )
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Migration code
}

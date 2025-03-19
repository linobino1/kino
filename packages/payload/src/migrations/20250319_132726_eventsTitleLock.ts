import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  // set events.titleLock to false (open lock), so that no titles will be automatically overwritten
  await payload.db.connection.collection('events').updateMany(
    {
      titleLock: { $exists: false },
    },
    [{ $set: { titleLock: false } }],
  )
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Migration code
}

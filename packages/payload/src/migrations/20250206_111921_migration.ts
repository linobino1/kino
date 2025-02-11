import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'
import { migrateRelationshipsV2_V3 } from '@payloadcms/db-mongodb/migration-utils'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  return
  await migrateRelationshipsV2_V3({
    batchSize: 100,
    req,
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Migration code
}

import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb'

// Legacy migration retained for migration history. Public URLs are now derived from route paths.
export async function up(_args: MigrateUpArgs): Promise<void> {
  void _args
  return
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // Migration code
}

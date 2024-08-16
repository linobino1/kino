import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-mongodb";

/**
 * this migration will just save all events to let their hooks run
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.update({
    collection: "events",
    where: {},
    data: {},
  });
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Migration code
}

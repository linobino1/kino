import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-mongodb";

// rename global key screeningsPage to eventsPage
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.connection.collections.globals.updateOne(
    { globalType: "screeningsPage" },
    { $set: { globalType: "eventsPage" } }
  );
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.connection.collections.globals.updateOne(
    { globalType: "eventsPage" },
    { $set: { globalType: "screeningsPage" } }
  );
}

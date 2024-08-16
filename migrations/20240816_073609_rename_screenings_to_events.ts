import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-mongodb";

/**
 * rename screenings to events, add a new field `type` to the events collection with the value `screening`
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // rename the screenings collection to events
  await payload.db.connection.db.renameCollection("screenings", "events", {
    dropTarget: true,
  });

  // add the field `type` to the events collection
  await payload.db.connection.db
    .collection("events")
    .updateMany({}, { $set: { type: "screening" } });
}

/**
 * rename events to screenings, remove the field `type` from the screenings collection
 */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // rename the events collection to screenings
  await payload.db.connection.db.renameCollection("events", "screenings", {
    dropTarget: true,
  });

  // remove the field `type` from the screenings collection
  await payload.db.connection.db
    .collection("screenings")
    .updateMany({}, { $unset: { type: "" } });
}

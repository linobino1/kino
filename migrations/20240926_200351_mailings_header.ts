import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-mongodb";

/**
 * mailings.headerImage -> mailings.header.image
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.collections.mailings?.updateMany({}, [
    {
      $set: {
        header: {
          image: "$headerImage",
        },
      },
    },
    {
      $unset: ["headerImage"],
    },
  ]);
}

/**
 * mailings.header.image -> mailings.headerImage
 */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.collections.mailings?.updateMany({}, [
    {
      $set: {
        headerImage: "$header.image",
      },
    },
    {
      $unset: ["header"],
    },
  ]);
}

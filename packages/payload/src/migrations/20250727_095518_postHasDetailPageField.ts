import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  // save all posts to populate the hasDetailPage field
  await payload.update({
    collection: 'posts',
    where: {
      id: {
        exists: true,
      },
    },
    data: {},
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {}

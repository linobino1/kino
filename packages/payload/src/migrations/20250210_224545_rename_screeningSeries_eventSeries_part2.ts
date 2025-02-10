import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

// CAUTON: this migration does not work! do it manually, save all docs from the collection via the admin UI

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  // save all the documents from the screeningSeries collection to re-calculate their URLs
  // await payload.update({
  //   collection: 'eventSeries',
  //   where: {
  //     _id: {
  //       exists: true,
  //     },
  //   },
  //   data: {
  //     url: '',
  //   },
  // })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Migration code
}

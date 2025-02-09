import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  await payload.db.connection.collection('media').updateMany(
    {
      _id: { $exists: true },
    },
    [
      {
        $set: {
          alt: {
            en: '$$ROOT.alt',
            de: '$$ROOT.alt',
          },
        },
      },
    ],
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  await payload.db.connection.collection('media').updateMany(
    {
      _id: { $exists: true },
    },
    [
      {
        $set: {
          alt: '$$ROOT.alt.de',
        },
      },
    ],
  )
}

import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

const collectionsWithDerivedURLs = [
  'posts',
  'pages',
  'events',
  'eventseries',
  'filmprints',
  'seasons',
] as const

const versionedCollections = ['posts', 'events', 'filmprints'] as const

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  for (const collection of collectionsWithDerivedURLs) {
    const { modifiedCount } = await payload.db.connection.collection(collection).updateMany(
      { url: { $exists: true } },
      { $unset: { url: '' } },
    )

    payload.logger.info(`Removed derived URL from ${modifiedCount} ${collection} documents`)
  }

  for (const collection of versionedCollections) {
    const versionCollection = `_${collection}_versions`
    const { modifiedCount } = await payload.db.connection
      .collection(versionCollection)
      .updateMany({ 'version.url': { $exists: true } }, { $unset: { 'version.url': '' } })

    payload.logger.info(`Removed derived URL from ${modifiedCount} ${versionCollection} documents`)
  }

  const { modifiedCount } = await payload.db.connection.collection('navigations').updateMany(
    { 'items.relPath': { $exists: true } },
    { $unset: { 'items.$[].relPath': '' } },
  )

  payload.logger.info(`Removed derived relative paths from ${modifiedCount} navigation documents`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Derived URL values cannot be restored independently of the route definitions and slugs.
  void _args
  return
}

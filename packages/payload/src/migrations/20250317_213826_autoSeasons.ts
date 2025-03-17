import {
  summerSemesterEnd,
  summerSemesterStart,
  winterSemesterEnd,
  winterSemesterStart,
} from '@app/util/config'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  // set slugLock to false
  await payload.db.connection.collection('seasons').updateMany({ _id: { $exists: true } }, [
    {
      $set: {
        slugLock: false,
      },
    },
  ])

  // unset sort field
  await payload.db.connection.collection('seasons').updateMany(
    {
      sort: { $exists: true },
    },
    [{ $unset: 'sort' }],
  )

  // generate from and until fields
  const seasons = await payload.find({
    collection: 'seasons',
    depth: 0,
    limit: 999,
  })
  for await (const season of seasons.docs) {
    const isWinterSemester = season.slug?.startsWith('ws')
    const year = parseInt(season.slug?.replace('ws-', '20').replace('ss-', '20') || '1970')
    const from = isWinterSemester
      ? winterSemesterStart.replace('yyyy', year.toString())
      : summerSemesterStart.replace('yyyy', year.toString())

    const until = isWinterSemester
      ? winterSemesterEnd.replace('yyyy', (year + 1).toString())
      : summerSemesterEnd.replace('yyyy', year.toString())

    await payload.update({
      collection: 'seasons',
      id: season.id,
      data: {
        from,
        until,
      },
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Migration code
}

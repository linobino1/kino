import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'
import { locales } from '@app/i18n'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  // screening events films -> programItems
  await payload.db.connection.collection('events').updateMany(
    {
      type: { $eq: 'screening' },
    },
    [
      {
        $set: {
          programItems: {
            $map: {
              input: '$films',
              as: 'film',
              in: {
                type: 'screening',
                id: '$$film.id',
                filmPrint: '$$film.filmprint',
                isMainProgram: {
                  $cond: {
                    if: {
                      $not: '$$film.isSupportingFilm',
                    },
                    then: true,
                    else: false,
                  },
                },
                info: '$$film.info',
              },
            },
          },
        },
      },
    ],
  )

  // unset films and type
  await payload.db.connection.collection('events').updateMany(
    {
      _id: { $exists: true },
    },
    [
      {
        $unset: ['films', 'type'],
      },
    ],
  )

  // moderator + guest -> comment
  await payload.db.connection.collection('events').updateMany(
    {
      moderator: { $exists: true },
      guest: { $exists: true },
    },
    [
      {
        $set: {
          comment: {
            en: { $concat: ['Moderated by ', '$moderator', ', as a guest: ', '$guest'] },
            de: { $concat: ['Moderiert von ', '$moderator', ', zu Gast: ', '$guest'] },
          },
        },
      },
      {
        $unset: 'moderator',
      },
    ],
  )

  // moderator -> comment
  await payload.db.connection.collection('events').updateMany(
    {
      moderator: { $exists: true },
    },
    [
      {
        $set: {
          comment: {
            en: { $concat: ['Moderated by ', '$moderator'] },
            de: { $concat: ['Moderiert von ', '$moderator'] },
          },
        },
      },
      {
        $unset: ['moderator', 'guest'],
      },
    ],
  )

  // guest -> comment
  await payload.db.connection.collection('events').updateMany(
    {
      guest: { $exists: true },
    },
    [
      {
        $set: {
          comment: {
            en: { $concat: ['Guest: ', '$guest'] },
            de: { $concat: ['Zu Gast: ', '$guest'] },
          },
        },
      },
      {
        $unset: 'guest',
      },
    ],
  )

  // info -> intro
  await payload.db.connection.collection('events').updateMany({ _id: { $exists: true } }, [
    {
      $set: {
        intro: '$info',
      },
    },
    {
      $unset: 'info',
    },
  ])

  // run payload hooks in all locales
  for await (const locale of locales) {
    await payload.update({
      collection: 'events',
      where: {
        id: { exists: true },
      },
      locale,
      data: {},
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Migration code
  throw new Error('Migration down function is not implemented')
}

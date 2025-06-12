import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  const mailings = await payload.db.collections.mailings.find()
  const MailingsVersionModel = payload.db.versions.mailings

  for (const mailing of mailings) {
    await payload.db.collections.mailings.updateOne(
      { _id: mailing._id },
      { $set: { _status: 'published' } },
    )

    const mailingVersion = await MailingsVersionModel.findOne({
      parent: mailing._id.toString(),
    })

    if (!mailingVersion) {
      await payload.db.versions.mailings.create({
        parent: mailing._id.toString(),
        version: {
          ...mailing,
          _status: 'published',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        latest: true,
        __v: 0,
      })
      console.info(`Created version for mailing: ${mailing._id.toString()}`)
    } else {
      console.info(`Version already exists for mailing: ${mailing._id.toString()}`)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Migration code
}

import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  return
  const posts = await payload.db.collections.posts.find()
  const PostsVersionModel = payload.db.versions.posts

  for (const post of posts) {
    await payload.db.collections.posts.updateOne(
      { _id: post._id },
      { $set: { _status: 'published' } },
    )

    const postVersion = await PostsVersionModel.findOne({
      parent: post._id.toString(),
    })

    if (!postVersion) {
      await payload.db.versions.posts.create({
        parent: post._id.toString(),
        version: {
          ...post,
          _status: 'published',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        latest: true,
        __v: 0,
      })
      console.info(`Created version for post: ${post._id.toString()}`)
    } else {
      console.info(`Version already exists for post: ${post._id.toString()}`)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Migration code
}

import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'
import { stringToLexicalJson } from '@app/util/lexical/stringToLexicalJson'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, session }: MigrateUpArgs): Promise<void> {
  const movies = await payload.db.collections.movies.find({
    _id: { $exists: true },
  })
  for await (const movie of movies) {
    const synopsis = {
      en: stringToLexicalJson(movie.synopsis?.en || ''),
      de: stringToLexicalJson(movie.synopsis?.de || ''),
    }

    console.info(`Updating movie ${movie.id} with synopsis:`, JSON.stringify(synopsis, null, 2))

    await payload.db.collections.movies.updateOne({ _id: movie._id }, { $set: { synopsis } })
  }

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Migration code
}

import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'
import { stringToLexicalJson } from '@app/util/lexical/stringToLexicalJson'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, session }: MigrateUpArgs): Promise<void> {
  for await (const language of ['en', 'de']) {
    const movies = await payload.db.collections.movies.find({
      [`synopsis.${language}`]: { $type: 'string' },
    })

    for await (const movie of movies) {
      const lexicalSynopsis = stringToLexicalJson(movie.synopsis?.[language] || '')

      await payload.db.collections.movies.updateOne(
        { _id: movie._id },
        { $set: { [`synopsis.${language}`]: lexicalSynopsis } },
      )
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Migration code
}

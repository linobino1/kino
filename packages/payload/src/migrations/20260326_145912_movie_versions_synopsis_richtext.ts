import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'
import { stringToLexicalJson } from '@app/util/lexical/stringToLexicalJson'

export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  // fix broken movie docs
  for await (const language of ['en', 'de']) {
    const movies = await payload.db.collections.movies.find({
      [`synopsis.${language}`]: { $type: 'string' },
    })
    console.info(`Found ${movies.length} movie docs with string synopsis in ${language}.`)

    for await (const movie of movies) {
      const lexicalSynopsis = stringToLexicalJson(movie.synopsis?.[language] || '')

      await payload.db.collections.movies.updateOne(
        { _id: movie._id },
        {
          $set: {
            [`synopsis.${language}`]: lexicalSynopsis,
          },
        },
      )
    }
  }

  for await (const language of ['en', 'de']) {
    // migrate movie versions
    const versions = await payload.db.versions.movies.find({
      [`version.synopsis.${language}`]: { $type: 'string' },
    })
    console.info(`Found ${versions.length} version docs with string synopsis in ${language}.`)

    for await (const doc of versions) {
      const lexicalSynopsis = stringToLexicalJson(doc.version.synopsis[language] || '')

      await payload.db.versions.movies.updateOne(
        { _id: doc._id },
        { $set: { [`version.synopsis.${language}`]: lexicalSynopsis } },
      )
    }
  }
}

export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Migration code
}
